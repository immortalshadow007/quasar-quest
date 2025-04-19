import React from 'react';
import Image from 'next/image';
import {FaHeart} from 'react-icons/fa';
import Link from 'next/link';
import ProductImg from './Product-image/product-image.webp';
import './product-display-style.css';

// ProductCard component definition
function ProductCard(props) {
    return (
      // Link wrapper for the entire product card
      <Link href="/" className="product">
        <div className="ProductCard">
          {/* Image container with relative positioning */}
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <Image 
              src={props.image} 
              alt="Product_Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          {/* Favorite icon */}
          <FaHeart className="FavIcon" />
          {/* Product details */}
          <p className="ProductName">{props.name}</p>
          <p className="ProductDisc">{props.disc}</p>
          <p className="ProductPrice">{props.price}</p>
        </div>
      </Link>
    );
  }

// Export the ProductCard component
export default ProductCard;
