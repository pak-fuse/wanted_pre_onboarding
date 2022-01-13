import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import mainBanner from 'data/mainbanner.json';
import Icons from 'components/Icons';
import { renderSlideList } from 'components/slide/renderSlideList';

import 'styles/slide/MainBanner.css';

const MainBanner = () => {
  const { PrevButton, NextButton } = Icons();

  const slideList = mainBanner;
  const slideCount = slideList.length;
  const slideListRef = useRef();

  const [centerMode, setCenterMode] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [jump, setJump] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  useLayoutEffect(() => {
    const browserWidth = window.innerWidth;

    setCenterMode({
      transform: `translateX(-${1146 - (browserWidth - 1060) / 2}px)`
    });
  }, []);

  useEffect(() => {
    const onTransitionEnd = () => {
      if (currentSlide >= slideCount) {
        setJump(true);
        setCurrentSlide(0);
      }
      if (currentSlide <= -1) {
        setJump(true);
        setCurrentSlide(slideCount - 1);
      }
    };

    slideListRef.current.addEventListener('transitionend', onTransitionEnd);

    return () =>
      slideListRef.current.removeEventListener(
        'transitionend',
        onTransitionEnd
      );
  }, [currentSlide, slideCount]);

  const slideListStyle = {
    transform: `translateX(-${(slideCount + currentSlide) * 1084}px)`,
    transition: `${jump ? 'none' : 'all 350ms ease-in-out'}`
  };

  const changeCurrent = amount => {
    setCurrentSlide(prev => prev + amount);
    setJump(false);
  };

  useEffect(() => {
    const startSwipe = event => {
      slideListRef.current.style.transition = 'none';
      setDragStart(event.clientX);
    };

    const doSwipe = event => {
      if (dragStart === null) return;

      slideListRef.current.style.transform = `translateX(-${
        (slideCount + currentSlide) * 1084 - (event.clientX - dragStart)
      }px)`;
    };

    const stopSwipe = event => {
      if (dragStart === null) return;

      slideListRef.current.style.transition = 'all 350ms ease-in-out';
      if (dragStart > event.clientX) changeCurrent(1);
      if (dragStart < event.clientX) changeCurrent(-1);

      setDragStart(null);
    };

    slideListRef.current.addEventListener('mousedown', startSwipe);
    slideListRef.current.addEventListener('mousemove', doSwipe);
    slideListRef.current.addEventListener('mouseleave', stopSwipe);
    slideListRef.current.addEventListener('mouseup', stopSwipe);

    return () => {
      slideListRef.current.removeEventListener('mousedown', startSwipe);
      slideListRef.current.removeEventListener('mousemove', doSwipe);
      slideListRef.current.removeEventListener('mouseleave', stopSwipe);
      slideListRef.current.removeEventListener('mouseup', stopSwipe);
    };
  }, [dragStart]);

  return (
    <main className="Main">
      <div className="slider">
        <div className="slider-track" style={{ ...centerMode }}>
          <ul
            className="slide-list"
            style={{ ...slideListStyle }}
            ref={slideListRef}
          >
            {renderSlideList(slideList, slideCount, currentSlide)}
          </ul>
        </div>
      </div>
      <button className="prev-arrow button" onClick={() => changeCurrent(-1)}>
        <PrevButton />
      </button>
      <button className="next-arrow button" onClick={() => changeCurrent(1)}>
        <NextButton />
      </button>
    </main>
  );
};

export default MainBanner;