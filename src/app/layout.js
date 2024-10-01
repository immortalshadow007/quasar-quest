import { Inter } from "next/font/google";
import "./globals.css";

import Navbar2 from "./Header/Navbar2";
import "./Header/header.css";
import Footer from "./Footer/Footer";
import "./Footer/Footer.css";

import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ELW",
  description: "My personal shopping website that works for me",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar2 />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
