import Navbar2 from "./home-page/components/Header/Navbar2";
import CategoryBar from "./home-page/components/Body/category-section/category-bar";
import SlidingBanner from "./home-page/components/Body/promotional-banner/slidingBanner";
import ProductDisplaySection from "./home-page/components/Body/static-product-display-1/product-display-structure";
import ProductGridDisplay from "./home-page/components/Body/static-product-display-2/product-display-structure-1";
import Footer from "./home-page/components/Footer/Footer";
import './globals.css'

export default function Home() {
  return (
    // Main application container
    <div className="App">
      {/* Navigation bar component */}
      <Navbar2 />
      {/* Main content area */}
      <div className="mainContent">
        {/* Container for the category bar */}
        <div className="categoryBarContainer">
          <CategoryBar />
        </div>
        {/* Sliding banner component */}
        <SlidingBanner />
        {/* Product display section component */}
        <ProductDisplaySection />
        {/* Flex container for grid displays */}
        <div className="gridContainer">
          <ProductGridDisplay />
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </div>
  );
}
