"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import styles from './SingupForm.module.css';
import login from "./Signup_Form_image/login_img.webp"

export default function SignupForm({ switchToLogin }) {
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [otpValue, setOtpValue] = useState(new Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const otpRefs = useRef([]);
  const phoneInputRef = useRef(null);
  const processingTimeoutRef = useRef(null);
  
  useEffect(() => {
    if (phoneInputRef.current && !isOtpRequested) {
      phoneInputRef.current.focus();
    }
  }, [isOtpRequested]);

  useEffect(() => {
    if (isOtpRequested && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [isOtpRequested]);

  useEffect(() => {
    if (isOtpRequested && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [isOtpRequested, resendTimer]);

  const handlePhoneFocus = () => setIsPhoneFocused(true);
  const handlePhoneBlur = (e) => {
    if (e.target.value === '') {
      setIsPhoneFocused(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    setPhoneError('');
  };

  const handleContinueClick = async () => {
    if (isProcessing || isButtonDisabled) {
      return;
    }

    if (phoneNumber.length !== 10 || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      setPhoneError('Please enter a valid Mobile number');
      return;
    }
  
    setPhoneError('');
    setIsButtonDisabled(true);
    setIsProcessing(true);
  
    try {
      // Send POST request to your API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CREATE_API_URL}`, 
        {
          mobile_number: `+91${phoneNumber}`, // Include country code in the payload
        },
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY, // Add the API key to the request headers
          }
        }
      );

      if (response.status === 201 || response.status === 200) { // Handle successful creation
        toast.success(`Verification code sent to ${phoneNumber}`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false, // Disable the close button
          className: styles.toast, // Apply custom toast style
          bodyClassName: styles.toastBody, // Apply custom body style
        });
        
        // Proceed to OTP section
        setIsOtpRequested(true);
        setResendTimer(15);
        setCanResend(false);
        setOtpValue(new Array(6).fill(''));
        setTimeout(() => {
          if (otpRefs.current[0]) {
            otpRefs.current[0].focus();
          }
        }, 0);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
          console.log('Rate limit hit');
          setIsRateLimited(true); // Trigger the rate limit state
      } else {
          setPhoneError('An error occurred. Please try again.');
      }
    } finally {
        setTimeout(() => {
            setIsButtonDisabled(false);
            setIsProcessing(false);
        }, 5000);
    }
  };

  const handleOtpChange = (e, index) => {
    if (/^\d*$/.test(e.target.value)) {
      const newOtpValue = [...otpValue];
      newOtpValue[index] = e.target.value;
      setOtpValue(newOtpValue);

      if (otpRefs.current[index]) {
        if (e.target.value !== "") {
          otpRefs.current[index].classList.add(styles.signupOtpFilled);
          if (index < otpValue.length - 1) {
            otpRefs.current[index + 1].focus();
          }
        } else {
          otpRefs.current[index].classList.remove(styles.signupOtpFilled);
          if (index > 0) {
            otpRefs.current[index - 1].focus();
          }
        }
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otpValue[index] === '') {
      if (otpRefs.current[index - 1]) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleChangeNumber = () => {
    setIsOtpRequested(false);
    setOtpValue(new Array(6).fill(''));
  };

  const handleResendOtp = async () => {
    setResendTimer(15);
    setCanResend(false);
  
    try {
      // Send POST request to your API to resend the OTP
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CREATE_API_URL}`, 
        {
          mobile_number: `+91${phoneNumber}`, // Include country code in the payload
        },
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY, // Add the API key to the request headers
          }
        }
      );
  
      if (response.status === 201 || response.status === 200) {
        toast.success(`Verification code sent to ${phoneNumber}`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false, // Disable the close button
          className: styles.toast, // Apply custom toast style
          bodyClassName: styles.toastBody, // Apply custom body style
        });
      }
    } catch (error) {
      setPhoneError('An error occurred. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isOtpRequested && !isProcessing) {
      e.preventDefault();
      handleContinueClick();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }
    };
  }, [phoneNumber, isOtpRequested, isProcessing]);

  return (
    <div className={styles.signupContainer}>
      <ToastContainer 
          position="bottom-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          toastClassName={styles.toast}
          bodyClassName={styles.toastBody}
          className={styles.toastContainer}
      />
      <div className={styles.leftSection}>
        <h1 className={styles.welcomeMessage}>Looks like you're new here!</h1>
        <p className={styles.subMessage}>Sign up with your mobile number to get started</p>
        <div className={styles.imageContainer}>
          <Image src={login} alt="Welcome" width={250} height={170} />
        </div>
      </div>
      <div className={styles.rightSection}>
        {isRateLimited ? (
          <div className={styles.verificationErrorContainer}>
            <div className={styles.verificationErrorMessage}>
              <h2 className={styles.verificationErrorTitle}>Verification unsuccessful</h2>
              <p className={styles.verificationErrorText}>Maximum attempts reached. Retry in 24 hours.</p>
            </div>
            <div className={styles.customerCareContainer}>
              <p>Need help logging in? Please call our Customer Care</p>
              <Link href="/contact-us" legacyBehavior>
                <a className={styles.contactUsLink}>Contact Us</a>
              </Link>
            </div>
          </div>
        ) : (
          !isOtpRequested ? (
            <>
              <div className={`${styles.inputContainer} ${isPhoneFocused || phoneNumber ? styles.focused : ''} ${phoneError ? styles.errorInput : ''}`}>
                <label className={styles.inputLabel} htmlFor="mobileNumber">Enter Mobile number</label>
                <div className={styles.phoneInputWrapper}>
                  {isPhoneFocused && phoneNumber.length > 0 && <span className={styles.prefix}>+91</span>}
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    id="mobileNumber"
                    className={styles.inputField}
                    maxLength="10"
                    pattern="\d{10}"
                    value={phoneNumber}
                    onFocus={handlePhoneFocus}
                    onBlur={handlePhoneBlur}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className={`${styles.inputUnderline} ${phoneError ? styles.errorUnderline : ''}`}>
                  {phoneError && <p className={styles.errorMessage}>{phoneError}</p>}
                </div>
              </div>
              <p className={styles.termsText}>
                By continuing, you agree to ELW's <Link href="/terms">Terms of Use</Link> and <Link href="/privacy">Privacy Policy</Link>.
              </p>
              <button className={styles.continueButton} onClick={handleContinueClick} disabled={isButtonDisabled}>
                Continue
              </button>
              <Link href="/account/login" legacyBehavior>
                <a className={styles.loginLink}>Existing User? Log in</a>
              </Link>
            </>
          ) : (
            <div className={styles.signupOtpSection}>
              <div className={styles.signupOtpHeaderContainer}>
                <p className={styles.signupOtpMessage}>Please enter the OTP sent to</p>
                <div className={styles.signupPhoneNumberContainer}>
                  <span>{phoneNumber}</span>
                  <button className={styles.signupChangeLink} onClick={handleChangeNumber}>Change</button>
                </div>
              </div>
              <div className={styles.signupOtpInputContainer}>
                {otpValue.map((digit, index) => (
                  <div key={index} className={styles.signupOtpInputWrapper}>
                    <input
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className={`${styles.signupOtpInputField} ${digit !== '' ? styles.signupOtpFilled : ''}`}
                      ref={(el) => otpRefs.current[index] = el}
                    />
                    <div className={`${styles.signupOtpInputUnderline} ${digit !== '' ? styles.signupOtpFilledUnderline : ''}`}></div>
                  </div>
                ))}
              </div>
              <button className={styles.signupVerifyOtpButton}>
                Verify
              </button>
              <div className={styles.signupResendCodeContainer}>
                <span className={styles.signupResendText}>Not received your code?</span>
                {canResend ? (
                  <button className={styles.signupResendCodeButton} onClick={handleResendOtp} type="button">
                    Resend code
                  </button>
                ) : (
                  <span className={styles.signupResendTimer}>{resendTimer}s</span>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}  


