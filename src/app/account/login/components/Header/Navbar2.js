"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FaSistrix, FaUser, FaChevronDown, FaUserCircle, FaGift, FaCreditCard } from 'react-icons/fa';
import { MdShoppingBasket, MdFavorite } from 'react-icons/md';
import { FaEllipsisV, FaBell, FaHeadset, FaDownload } from 'react-icons/fa';
import './header.css';

import cart from './Header-images/shopping-cart-icon.png';
import offer from './Header-images/chatbot.png';
import logo from './Header-images/logo.webp';


function Navbar2() {
  // State declarations
  const [hovered, setHovered] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginAreaHovered, setIsLoginAreaHovered] = useState(false);

  // Effect for handling sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Handle the search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="Navbar2">
      {/* Spacer component */}
      <div className="navbar-spacer"/>
      {/* LOGO SECTION */}
      <div className="logo-column">
        <Link href="/">
            <Image src={logo} alt="logo" />
        </Link>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="search-column">
        <form className="search" action="#">
          <FaSistrix className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* LOGIN BUTTON */}
      <div 
        className="login-container"
        onMouseEnter={() => {
          setIsDropdownOpen(true);
          setIsLoginAreaHovered(true);
        }}
        onMouseLeave={() => {
          setIsDropdownOpen(false);
          setIsLoginAreaHovered(false);
        }}
      >
        <Link href="/account/login">
          <button className={`login-btn ${isLoginAreaHovered ? 'highlighted' : ''}`}>
            <FaUser className="login-icon" />
            <span>Login</span>
            <FaChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
          </button>
        </Link>
        
        {isDropdownOpen && (
          <div className="login-dropdown">
            <div className="new-customer">
              <span>New customer?</span>
              <Link href="/account/login?signup=true" legacyBehavior>
                <a className='signup-link'>
                  Sign up
                </a>
              </Link>
            </div>
            <ul className="dropdown-menu">
              <li><FaUserCircle /> My Profile</li>
              <li><MdShoppingBasket /> Orders</li>
              <li><MdFavorite /> Wishlist</li>
            </ul>
          </div>
        )}
      </div>

      {/* CART ICON */}
      <div>
        <a href="#">
          <Image src={cart} alt="shopping-cart-icon" width={25} height={25} />
        </a>
      </div>

      {/* CHATBOT ICON */}
      <div>
        <a href="#">
          <Image src={offer} alt="offer-icon" width={35} height={35} />
        </a>
      </div>

      {/* More Options Menu */}
      <div 
        className="more-options-container"
        onMouseEnter={() => setIsMoreMenuOpen(true)}
        onMouseLeave={() => setIsMoreMenuOpen(false)}
      >
        <button className={`more-options-btn ${isMoreMenuOpen ? 'active' : ''}`}>
          <FaEllipsisV />
        </button>
        
        {isMoreMenuOpen && (
          <div className="more-options-dropdown">
            <ul>
              <li><a href="/notifications"><FaBell /> Notification Preferences</a></li>
              <li><a href="/customer-care"><FaHeadset /> 24x7 Customer Care</a></li>
              <li><a href="/download-app"><FaDownload /> Download App</a></li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Spacer component */}
      <div className="navbar-spacer"></div>
      {/* Spacer component */}
      <div className="navbar-spacer"></div>
    </div>
  );
}

export default Navbar2;


