"use client";

import React, { useRef } from 'react';
import './product-display-style.css';
import ProductCard from './product-card';
import productData from './product-data';
import { FaChevronCircleRight } from 'react-icons/fa';

function Productslider() {
    // Create a ref for the slider element to manipulate its scroll position
    const sliderRef = useRef(null);

    // Function to scroll the slider to the left
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -300, // Scroll 300px to the left
                behavior: 'smooth' // Smooth scrolling animation
            });
        }
    };

    // Function to scroll the slider to the right
    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: 300, // Scroll 300px to the right
                behavior: 'smooth' // Smooth scrolling animation
            });
        }
    };

    return (
        <div className="page-wrapper">
            <div className="product-slider-container">
                {/* Header section of the slider */}
                <div className="slider-header">
                    <span className="slider-heading">Beauty, Food, Toys & more</span>
                    {/* "View All" button with right arrow icon */}
                    <span className="view-all-button">
                        <a href="/full-product-list" className="view-button">
                            <FaChevronCircleRight className="arrow-icon" />
                        </a>
                    </span>
                </div>
                {/* Main slider section */}
                <div className="product-main-slider-wrapper">
                    {/* Left scroll button */}
                    <button className="slider-button left" onClick={scrollLeft}>&#10094;</button>
                    {/* Container for product cards */}
                    <div className="product-main-slider" ref={sliderRef}>
                        {/* Map through product data and render ProductCard for each item */}
                        {productData.map(product => (
                            <ProductCard
                                key={product.id}
                                image={product.pro_img}
                                name={product.pro_name}
                                discount={product.pro_discount}
                            />
                        ))}
                    </div>
                    {/* Right scroll button */}
                    <button className="slider-button right" onClick={scrollRight}>&#10095;</button>
                </div>
            </div>
        </div>
    );
}

export default Productslider;
