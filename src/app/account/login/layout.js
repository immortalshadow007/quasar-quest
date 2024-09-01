// signup-page/layout.js
import Navbar2 from './components/Header/Navbar2';
import Footer from './components/Footer/Footer';

export default function SignupLayout({ children }) {
  return (
    <div className="signup-layout">
      <Navbar2 />
      <main className="signup-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}