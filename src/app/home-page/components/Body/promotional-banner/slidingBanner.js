"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import slide from './slider/icon.webp';
import slide1 from './slider/icon1.webp'
import './slider.css';

// Data for slides
const slides = [
  { image: slide, alt: 'Slide 1'},
  { image: slide1, alt: 'Slide 2'},
  { image: slide, alt: 'Slide 3'},
  { image: slide, alt: 'Slide 4'},
  { image: slide, alt: 'Slide 5'},
  { image: slide, alt: 'Slide 6'},
];

const SlidingBanner = () => {
  // State to keep track of current slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  // State to track if slide is transitioning (not used in this component)
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Function to move to next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  // Function to move to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Effect to automatically change slides every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [nextSlide]);

  return (
    <div className="sliding-banner">
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className={`slide ${index === currentIndex ? 'active' : ''}`}>
            <div className="image-wrapper">
              <Image src={slide.image} alt={slide.alt} layout="fill" />
            </div>
            <p className="promotional-banner">{slide.name}</p>
          </div>
        ))}
      </div>
      <button className="next" onClick={nextSlide}>&#10095;</button>
      <div className="dots">
        {slides.map((_, index) => (
          <span key={index} className={`dot ${index === currentIndex ? 'active' : ''}`}></span>
        ))}
      </div>
    </div>
  );
};

export default SlidingBanner;
