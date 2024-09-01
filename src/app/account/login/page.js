// src/app/account/login/page.js
"use client";

import { useSearchParams } from 'next/navigation';
import SignupForm from './components/Body/SignupForm/SignupForm';
import LoginForm from './components/Body/LoginForm/LoginForm';

export default function AccountPage() {
  const searchParams = useSearchParams();
  const signup = searchParams.get('signup');

  const handleSwitchToLogin = () => {
    window.history.pushState({}, '', '/account/login');
  };

  const handleSwitchToSignup = () => {
    window.history.pushState({}, '', '/account/login?signup=true');
  };

  return (
    <div className="login-page-container">
      {signup === 'true' ? (
        <SignupForm switchToLogin={handleSwitchToLogin} />
      ) : (
        <LoginForm switchToSignup={handleSwitchToSignup} />
      )}
    </div>
  );
}
