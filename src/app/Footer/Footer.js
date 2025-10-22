import React from 'react';
import Image from 'next/image';
import './Footer.css';
import payment from './footer-images/payment-method.svg';
import { FaBullhorn, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaGift, FaQuestionCircle, FaStore } from 'react-icons/fa';

// Define the structure for footer sections
const footerSections = [
  {
    title: "ABOUT",
    links: ["Contact Us", "About Us", "Careers", "Material Buy Stories", "Press", "Corporate Information"]
  },
  {
    title: "GROUP COMPANIES",
    links: ["None yet"]
  },
  {
    title: "HELP",
    links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ", "Report Infringement"]
  },
  {
    title: "CONSUMER POLICY",
    links: ["Cancellation & Returns", "Terms Of Use", "Security", "Privacy", "Sitemap", "Grievance Redressal", "EPR Compliance"]
  }
];

// Component for rendering individual footer sections
const FooterSection = ({ title, links }) => (
  <div className="footer-column">
    <h3 className="footer-title">{title}</h3>
    <ul className="footer-list">
      {links.map((link, index) => (
        <li key={index}><a href="/">{link}</a></li>
      ))}
    </ul>
  </div>
);

// Main Footer component
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Left side of the footer */}
        <div className="footer-left">
          {footerSections.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}
        </div>

        {/* Separator */}
        <div className="footer-separator"></div>

        {/* Right side of the footer */}
        <div className="footer-right">
          {/* Mail Us section */}
          <div className="mail-us">
            <h3>Mail Us:</h3>
            <p>ELW Private Limited,<br />
              Buildings XYZ, ABC<br />
              Raven Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India</p>
              {/* Social media links */}
              <div className="social-media">
                <p>Social:</p>
                <div className="social-icons">
                  <a href="/"><FaFacebook /></a>
                  <a href="/"><FaTwitter /></a>
                  <a href="/"><FaYoutube /></a>
                </div>
              </div>
          </div>

          {/* Registered Office Address section */}
          <div className="registered-office">
            <h3>Registered Office Address:</h3>
            <p>ELW Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India<br />
              CIN : U51109KA2012PTC066107<br />
              Telephone: <a href="tel:044-45614700">044-45614700</a></p>
          </div>
        </div>
      </div>
      
      {/* Footer bottom section */}
      <div className="footer-bottom-separator"></div>
      <div className="footer-bottom">
        {/* Footer links */}
        <div className="footer-links">
          <div className="footer-link-item">
            <a href="/"><FaStore/> Become a Seller</a>
          </div>
          <div className="footer-link-item">
            <a href="/"><FaBullhorn /> Advertise</a>
          </div>
          <div className="footer-link-item">
            <a href="/"><FaGift /> Gift Cards</a>
          </div>
          <div className="footer-link-item">
            <a href="/"><FaQuestionCircle /> Help Center</a>
          </div>
        </div>
        {/* Copyright */}
        <div className="copyright">
          © 2024 MaterialBuy.com
        </div>
        {/* Payment options */}
        <div className="payment-options">
          <Image src={payment} alt="payment-method" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;


