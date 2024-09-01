// Import necessary React and Next.js components
import React from 'react';
import Image from 'next/image';

// Import images for category icons
import electronics from './Product-tile/electronics.webp';
import mobiles from './Product-tile/mobiles.webp';
import grocery from './Product-tile/grocery.webp';
import fashion from './Product-tile/fashion.webp';
import appliances from './Product-tile/appliances.webp';
import home from './Product-tile/home.webp';
import bike from './Product-tile/bike.webp';

// Import CSS styles
import './category-bar.css';

// Data structure for categories
const menuItems = [
  { 
    text: 'Grocery', 
    image: grocery,
    href: '/grocery',
    className: 'category-grocery'
  },
  { 
    text: 'Mobiles',
    image: mobiles,
    href: '/mobiles',
    className: 'category-mobiles'
  },
  { 
    text: 'Fashion',
    image: fashion,
    href: '/fashion',
    className: 'category-fashion'
  },
  { 
    text: 'Electronics',
    image: electronics,
    href: '/electronics',
    className: 'category-electronics'
  },
  { 
    text: 'Home and Furniture',
    image: home,
    href: '/home-furniture',
    className: 'category-home-furniture'
  },
  { 
    text: 'Appliances',
    image: appliances,
    href: '/appliances',
    className: 'category-appliances'
  },
  { 
    text: 'Beauty Toys and More',
    image: grocery,
    href: '/beauty-toys-more',
    className: 'category-beauty-toys-more'
  },
  { 
    text: 'Two Wheelers',
    image: bike,
    href: '/two-wheelers',
    className: 'category-two-wheelers'
  }
];

// Define LinkItems component
function LinkItems() {
  return (
    <div className="categoryBarContainer">
      <div className="linkGrid">
        {menuItems.map((item, index) => (
          <a key={index} href={item.href} className={`categoryItem ${item.className}`}>
            <Image src={item.image} alt={`${item.text} category`} className="iconPlaceholder" width={50} height={50} />
            <span className="text">{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// Export the LinkItems component as default
export default LinkItems;
