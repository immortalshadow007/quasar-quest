import ProductImg from './Product-image/product-image.webp';

// Object containing arrays of product data objects for each section
const productData = {
    section1: [
        { id: 1, pro_img: ProductImg, pro_name: "Smart Watches", pro_disc: "Upto 10% off", pro_price: "Rs 1477" },
        { id: 2, pro_img: ProductImg, pro_name: "Smart Bands", pro_disc: "Upto 10% off", pro_price: "Rs 1477" },
        { id: 3, pro_img: ProductImg, pro_name: "NeckBand", pro_disc: "Upto 10% off", pro_price: "Rs 1477" },
        { id: 4, pro_img: ProductImg, pro_name: "Wireless Earphone", pro_disc: "Upto 10% off", pro_price: "Rs 1477" }
    ],
    section2: [
        { id: 5, pro_img: ProductImg, pro_name: "Exercise & Fitness", pro_disc: "Min. 50% Off", pro_price: "Rs 1477" },
        { id: 6, pro_img: ProductImg, pro_name: "Dumbbells", pro_disc: "Special offer", pro_price: "Rs 1477" },
        { id: 7, pro_img: ProductImg, pro_name: "Men's Sports Shoes", pro_disc: "Min. 70% Off", pro_price: "Rs 1477" },
        { id: 8, pro_img: ProductImg, pro_name: "Water Bottles & Flasks", pro_disc: "Special offer", pro_price: "Rs 1477" }
    ],
    section3: [
        { id: 9, pro_img: ProductImg, pro_name: "Hair Oil", pro_disc: "Min. 50% Off", pro_price: "Rs 1477" },
        { id: 10, pro_img: ProductImg, pro_name: "Toner", pro_disc: "Min. 50% Off", pro_price: "Rs 1477" },
        { id: 11, pro_img: ProductImg, pro_name: "Umbrellas", pro_disc: "Min. 50% Off", pro_price: "Rs 1477" },
        { id: 12, pro_img: ProductImg, pro_name: "Skin Brightening Cream", pro_disc: "Min. 50% Off", pro_price: "Rs 1477" }
    ]
};

// Export the productData array
export default productData;