import React from 'react';
import './product-display-style-1.css';
import ProductCard from './product-card';
import productData from './product-data';
import { FaChevronCircleRight } from 'react-icons/fa';

function ProductGridDisplayer() {
    return (
        <div className="pds1-page-wrapper">
            <div className="pds1-container">
                {/* Section 1 */}
                <div className="pds1-product-display-container">
                    <div className="pds1-slider-header">
                        <span className="pds1-slider-heading">Monsoon Essentials</span>
                        <span className="pds1-view-all-button">
                            <a href="/full-product-list" className="pds1-view-button">
                                <FaChevronCircleRight className="pds1-arrow-icon" />
                            </a>
                        </span>
                    </div>
                    <div className="pds1-product-grid-container">
                        {productData.section1.map(product => (
                            <ProductCard
                                key={product.id}
                                image={product.pro_img}
                                name={product.pro_name}
                                discount={product.pro_discount}
                            />
                        ))}
                    </div>
                </div>
                {/* Section 2 */}
                <div className="pds1-product-display-container">
                    <div className="pds1-slider-header">
                        <span className="pds1-slider-heading">Best of Health & Wellness</span>
                        <span className="pds1-view-all-button">
                            <a href="/full-product-list" className="pds1-view-button">
                                <FaChevronCircleRight className="pds1-arrow-icon" />
                            </a>
                        </span>
                    </div>
                    <div className="pds1-product-grid-container">
                        {productData.section2.map(product => (
                            <ProductCard
                                key={product.id}
                                image={product.pro_img}
                                name={product.pro_name}
                                discount={product.pro_discount}
                            />
                        ))}
                    </div>
                </div>
                {/* Section 3 */}
                <div className="pds1-product-display-container">
                    <div className="pds1-slider-header">
                        <span className="pds1-slider-heading">Monsoon Hair & Skincare</span>
                        <span className="pds1-view-all-button">
                            <a href="/full-product-list" className="pds1-view-button">
                                <FaChevronCircleRight className="pds1-arrow-icon" />
                            </a>
                        </span>
                    </div>
                    <div className="pds1-product-grid-container">
                        {productData.section3.map(product => (
                            <ProductCard
                                key={product.id}
                                image={product.pro_img}
                                name={product.pro_name}
                                discount={product.pro_discount}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductGridDisplayer;
