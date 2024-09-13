"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import login from "./Login_Form_image/login_img.webp";

export default function LoginForm({ switchToSignup }) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showPrefix, setShowPrefix] = useState(false);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [otpValue, setOtpValue] = useState(new Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const showToast = localStorage.getItem('showToast');
  const router = useRouter();
  const otpRefs = useRef([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOtpRequested && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [isOtpRequested, resendTimer]);

  useEffect(() => {
    if (showToast === 'true') {
      // Display toast notification when redirected with showToast state
      toast.info('You are already registered. Please log in.', {
        position: "bottom-center",
        autoClose: 2000,  // Show the toast for 2 seconds
        hideProgressBar: true,
        closeButton: false,
        className: styles.infoToast,
        bodyClassName: styles.infoToastBody,
      });
      localStorage.removeItem('showToast');
      // Clean up the URL after showing the toast
      router.replace('/account/login', undefined, { shallow: true });
    }
  }, [showToast]);

  useEffect(() => {
    if (!isOtpRequested && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the mobile number input field when returning to login input area
    }
  }, [isOtpRequested]);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e) => {
    if (e.target.value === '') {
      setIsFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const isNumber = /^\d+$/.test(value);
    const isValidMobileNumber = isNumber && value.length <= 10;

    if (isNumber && value.length > 0 && value.length <= 10) {
      setShowPrefix(true);
    } else {
      setShowPrefix(false);
    }

    setInputValue(value);
  };

  const handleRequestOtp = () => {
    if (inputValue.length === 10) {
      setIsOtpRequested(true);
      setResendTimer(15);
      setCanResend(false);
      setOtpValue(new Array(6).fill(''));
      setTimeout(() => {
        if (otpRefs.current[0]) {
          otpRefs.current[0].focus(); // Focus on the first OTP input field
        }
      }, 0);
    }
  };

  const handleOtpChange = (e, index) => {
    if (/^\d*$/.test(e.target.value)) {
      const newOtpValue = [...otpValue];
      newOtpValue[index] = e.target.value;
      setOtpValue(newOtpValue);
  
      if (otpRefs.current[index]) {  // Add this check
        if (e.target.value !== "") {
          otpRefs.current[index].classList.add(styles.otpFilled);
          if (index < otpValue.length - 1) {
            otpRefs.current[index + 1].focus();
          }
        } else {
          otpRefs.current[index].classList.remove(styles.otpFilled);
          if (index > 0) {
            otpRefs.current[index - 1].focus();
          }
        }
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otpValue[index] === '') {
        if (index > 0) {
          setOtpValue((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index - 1] = '';
            return newOtp;
          });
          otpRefs.current[index - 1].focus();
        }
      } else {
        setOtpValue((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index] = '';
          return newOtp;
        });
      }
    }
  };

  const handleChangeNumber = () => {
    setIsOtpRequested(false);
    setOtpValue(new Array(6).fill(''));
  };

  const handleResendOtp = () => {
    setResendTimer(15);
    setCanResend(false);
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer 
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        toastClassName={styles.toast}
        bodyClassName={styles.toastBody}
      />
      <div className={styles.loginLeftSection}>
        <h1 className={styles.loginWelcomeMessage}>Login</h1>
        <p className={styles.loginSubMessage}>
          Get access to your Orders, Wishlist and Recommendations
        </p>
        <div className={styles.loginImageContainer}>
          <Image src={login} alt="Welcome" width={250} height={170} />
        </div>
      </div>
      <div className={styles.loginRightSection}>
        {!isOtpRequested ? (
          <>
            <div
              className={`${styles.loginInputContainer} ${isFocused ? styles.loginFocused : ''}`}
            >
                
                <label className={styles.loginInputLabel} htmlFor="emailOrMobile">
                    Enter Email/Mobile number
                </label>
              <div className={styles.loginInputWrapper}>
                {showPrefix && <span className={styles.prefix}>+91</span>}
                <input
                  type="text"
                  id="emailOrMobile"
                  className={styles.loginInputField}
                  value={inputValue}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleRequestOtp(); }}
                  ref={inputRef}
                />
              </div>
              <div className={styles.loginInputUnderline}></div>
            </div>
            <p className={styles.loginTermsText}>
              By continuing, you agree to ELW's{' '}
              <Link href="/terms">Terms of Use</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
            <button
              className={styles.loginContinueButton}
              onClick={handleRequestOtp}
              disabled={inputValue.length !== 10}
            >
              Request OTP
            </button>
            <Link href="/account/login?signup=true" legacyBehavior>
              <a className={styles.createAccountLink}>New to ELW? Create an account</a>
            </Link>
          </>
        ) : (
          <div className={styles.otpSection}>
            <div className={styles.otpHeaderContainer}>
              <p className={styles.otpMessage}>
                Please enter the OTP sent to
              </p>
              <div className={styles.phoneNumberContainer}>
                <span>{inputValue}</span>
                <button className={styles.changeLink} onClick={handleChangeNumber}>Change</button>
              </div>
            </div>
            <div className={styles.otpInputContainer}>
              {otpValue.map((digit, index) => (
                <div key={index} className={styles.otpInputWrapper}>
                  <input
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className={`${styles.otpInputField} ${digit !== '' ? styles.otpFilled : ''}`}
                    ref={(el) => otpRefs.current[index] = el}
                  />
                  <div className={`${styles.otpInputUnderline} ${digit !== '' ? styles.otpFilledUnderline : ''}`}></div>
                </div>
              ))}
            </div>
            <button className={styles.verifyOtpButton}>
              Verify
            </button>
            <div className={styles.resendCodeContainer}>
              <span className={styles.resendText}>Not received your code?</span>
              {canResend ? (
                <button className={styles.resendCodeButton} onClick={handleResendOtp}>
                  Resend code
                </button>
              ) : (
                <span className={styles.resendTimer}>{resendTimer}s</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
