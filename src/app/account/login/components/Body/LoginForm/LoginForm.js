"use client";

import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import styles from './LoginForm.module.css';
import loginImage from './Login_Form_image/login_img.webp';

// Function to hash the mobile number and OTP using the Web Cryptography API
async function hashData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function LoginForm({ switchToSignup }) {
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPrefix, setShowPrefix] = useState(false);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [otpValue, setOtpValue] = useState(new Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPhoneTimeoutActive, setIsPhoneTimeoutActive] = useState(false);
  const { login } = useContext(AuthContext);
  const showToast = localStorage.getItem('showToast');
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpTimeoutRef = useRef(null);
  const phoneInputRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  useEffect(() => {
    if (phoneInputRef.current && !isOtpRequested) {   
      phoneInputRef.current.focus();
    }
  }, [isOtpRequested]);

  useEffect(() => {
    if (phoneInputRef.current && !isOtpRequested) {   
      phoneInputRef.current.focus();
    }
  }, [isOtpRequested]);

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
    if (isOtpRequested) {
      otpTimeoutRef.current = setTimeout(() => {
        // If 10 minutes pass, trigger the timeout behavior
        toast.error('Something went wrong. Please try again.', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          className: styles.errorToast,
          bodyClassName: styles.errorToastBody,
        });
  
        // Return user to the mobile number entry section and focus input
        setIsOtpRequested(false);
        setTimeout(() => {
          if (phoneInputRef.current) {
            phoneInputRef.current.focus();
          }
        }, 0);
  
      }, 600000);
  
      return () => clearTimeout(otpTimeoutRef.current);
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
    const value = e.target.value;
    const isNumber = /^\d+$/.test(value);

    if (isNumber && value.length > 0 && value.length <= 10) {
      setShowPrefix(true);
    } else {
      setShowPrefix(false);
    }

    const sanitizedValue = value.replace(/\D/g, '');
    setPhoneNumber(sanitizedValue);
    setPhoneError('');
  };

  const handleRequestOtp = async () => {
    if (isProcessing || isButtonDisabled || isPhoneTimeoutActive) {
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
      // Send POST request to your API to check for existing account
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOGIN_API_URL}`, 
        {
          mobile_number: `+91${phoneNumber}`,
        },
        {
          headers: {
            'B-API-KEY': process.env.NEXT_PUBLIC_LOGIN_API_KEY,
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success(`Verification code sent to ${phoneNumber}`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          className: styles.toast,
          bodyClassName: styles.toastBody,
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
      if (error.response && error.response.status === 409) {
        localStorage.setItem('showSignupToast', true);
        router.push('login?signup=true');
      } else if (error.response && error.response.status === 429) {
        setIsRateLimited(true);
      } else {
        setPhoneError('An error occurred. Please try again.');
      }
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
        setIsProcessing(false);
        setIsPhoneTimeoutActive(false);
      }, 5000);
    }
  };

  let otpDebounce;

  const handleOtpChange = (e, index) => {
    if (/^\d*$/.test(e.target.value)) {
      const newOtpValue = [...otpValue];
      newOtpValue[index] = e.target.value;
      setOtpValue(newOtpValue);

      if (otpTimeoutRef.current) {
        clearTimeout(otpTimeoutRef.current);
        otpTimeoutRef.current = setTimeout(() => {
          toast.error('Something went wrong. Please try again.', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false,
            className: styles.errorToast,
            bodyClassName: styles.errorToastBody,
          });
          setIsOtpRequested(false);
          setTimeout(() => {
            if (phoneInputRef.current) {
              phoneInputRef.current.focus();
            }
          }, 0);
        }, 600000);
      }
  
      // Move focus to the next input field or handle backspace
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
  
      // Check if all OTP fields are filled and trigger auto verification
      const isOtpComplete = newOtpValue.every(digit => digit !== '');
      if (isOtpComplete) {
        handleVerifyClick();
      }
    }
    setOtpError('');
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
    setOtpError('');
  };

  const handleVerifyClick = async () => {
    const isOtpComplete = otpValue.every(digit => digit !== '');
    if (!isOtpComplete) {
      setOtpError('Please fill out this field.');
      return;
    }

    setIsButtonDisabled(true);
    setIsProcessing(true);

    try {
      // Hash mobile number and OTP using SubtleCrypto
      const mobileNumberHash = await hashData(`+91${phoneNumber}`);
      const otpHash = await hashData(otpValue.join(''));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERIFY_API_URL}`,
        {
          mobile_number_hash: mobileNumberHash,
          otp_hash: otpHash,
        },
        {
          headers: {
            'V-API-KEY': process.env.NEXT_PUBLIC_VERIFY_API_KEY,
          }
        }
      );

      if (response.status === 200) {
        const sessionResponse = await axios.post(
          '/api/createSession',
          {
            mobile_number: `+91${phoneNumber}`,
            mobile_number_hash: mobileNumberHash
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true,
          },
        );

        if (sessionResponse.status === 200) {
          login();
          // await refreshSession(); //
          router.push('/');
        } else {
          setOtpError('Session creation failed. Please try again.');
        }
      } else if (response.status === 403) {
        toast.error('OTP is incorrect', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          className: styles.errorToast,
          bodyClassName: styles.errorToastBody,
          icon: "❗"
        });
      } else {
        setOtpError('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error("Error during OTP verification: ", error);

      if (error.response && error.response.status === 403) {
        toast.error('OTP is incorrect', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          className: styles.errorToast,
          bodyClassName: styles.errorToastBody,
          icon: "❗"
        });
      } else {
        setOtpError('An error occurred during verification. Please try again.');
      }
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
        setIsProcessing(false);
      }, 5000);
    }
  };

  const handleResendOtp = async () => {
    setResendTimer(15);
    setCanResend(false);
  
    try {
      // Send POST request to your API to resend the OTP
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOGIN_API_URL}`, 
        {
          mobile_number: `+91${phoneNumber}`,
        },
        {
          headers: {
            'B-API-KEY': process.env.NEXT_PUBLIC_LOGIN_API_KEY,
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
    if (e.key === 'Enter' && !isProcessing) {
      e.preventDefault();
      if (!isOtpRequested) {
        handleRequestOtp();
      } else if (isOtpRequested && otpValue.every(digit => digit !== '')) {
        handleVerifyClick();
      }
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
  }, [phoneNumber, isOtpRequested, otpValue, isProcessing]);

  return (
    <div className={styles.loginContainer}>
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
      <div className={styles.loginLeftSection}>
        <h1 className={styles.loginWelcomeMessage}>Login</h1>
        <p className={styles.loginSubMessage}>Get access to your Orders, Wishlist and Recommendations</p>
        <div className={styles.loginImageContainer}>
          <Image src={loginImage} alt="Welcome" width={250} height={170} />
        </div>
      </div>
      <div className={styles.loginRightSection}>
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
              <div className={`${styles.loginInputContainer} ${isPhoneFocused || phoneNumber ? styles.loginFocused : ''} ${phoneError ? styles.loginerrorInput : ''}`}>
                <label className={styles.loginInputLabel} htmlFor="mobileNumber">Enter Mobile number</label>
                <div className={styles.loginInputWrapper}>
                  {isPhoneFocused && phoneNumber.length > 0 && <span className={styles.prefix}>+91</span>}
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    id="mobileNumber"
                    className={styles.loginInputField}
                    maxLength="10"
                    pattern="\d{10}"
                    value={phoneNumber}
                    onFocus={handlePhoneFocus}
                    onBlur={handlePhoneBlur}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className={`${styles.loginInputUnderline} ${phoneError ? styles.errorUnderline : ''}`}>
                  {phoneError && <p className={styles.loginerrorMessage}>{phoneError}</p>}
                </div>
              </div>
              <p className={styles.loginTermsText}>
                By continuing, you agree to ELW's <Link href="/terms">Terms of Use</Link> and <Link href="/privacy">Privacy Policy</Link>.
              </p>
              <button className={styles.loginContinueButton} onClick={handleRequestOtp} disabled={isButtonDisabled}>
                Request OTP
              </button>
              <Link href="/account/login?signup=true" legacyBehavior>
                <a className={styles.createAccountLink}>New to ELW? Create an account</a>
              </Link>
            </>
          ) : (
            <div className={styles.otpSection}>
              <div className={styles.otpHeaderContainer}>
                <p className={styles.otpMessage}>Please enter the OTP sent to</p>
                <div className={styles.phoneNumberContainer}>
                  <span>{phoneNumber}</span>
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
              {otpError && <p className={styles.otpErrorMessage}>{otpError}</p>}
              <button className={styles.verifyOtpButton} onClick={handleVerifyClick} disabled={isButtonDisabled || otpValue.some(digit => digit === '')}>
                Verify
              </button>
              <div className={styles.resendCodeContainer}>
                <span className={styles.resendText}>Not received your code?</span>
                {canResend ? (
                  <button className={styles.resendCodeButton} onClick={handleResendOtp} type="button">
                    Resend code
                  </button>
                ) : (
                  <span className={styles.resendTimer}>{resendTimer}</span>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
