"use client";

import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import styles from './SingupForm.module.css';
import signupImage from './Signup_Form_image/login_img.webp';

// Function to hash the mobile number and OTP using the Web Cryptography API
async function hashData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function SignupForm({ switchToLogin }) {
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const searchParams = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true'
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const { login } = useContext(AuthContext);
  const [otpValue, setOtpValue] = useState(new Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPhoneTimeoutActive, setIsPhoneTimeoutActive] = useState(false);
  const showSignupToast = localStorage.getItem('showSignupToast');
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef([]);
  const router = useRouter();
  const otpTimeoutRef = useRef(null);
  const phoneInputRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  useEffect(() => {
    if (phoneInputRef.current && !isOtpRequested) {   
      phoneInputRef.current.focus();
    }
  }, [isOtpRequested]);

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
    if (showSignupToast === 'true') {
      toast.info('You are not registered with us. Please sign up.', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        className: styles.infoToast,
        bodyClassName: styles.infoToastBody,
      });
      localStorage.removeItem('showSignupToast');
    }
  }, [isSignup]);

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
        `${process.env.NEXT_PUBLIC_CREATE_API_URL}`, 
        {
          mobile_number: `+91${phoneNumber}`,
        },
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
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
        localStorage.setItem('showToast', true);
        router.push('/account/login');
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
  
      // Clear and reset the timeout whenever the user enters OTP digits
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
        toast.success('OTP Verification successful', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          className: styles.toast,
          bodyClassName: styles.toastBody,
        });

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
        `${process.env.NEXT_PUBLIC_CREATE_API_URL}`, 
        {
          mobile_number: `+91${phoneNumber}`,
        },
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
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
        handleContinueClick();
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
          <Image src={signupImage} alt="Welcome" width={250} height={170} />
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
              {otpError && <p className={styles.otpErrorMessage}>{otpError}</p>}
              <button className={styles.signupVerifyOtpButton} onClick={handleVerifyClick} disabled={isButtonDisabled || otpValue.some(digit => digit === '')}>
                Verify
              </button>
              <div className={styles.signupResendCodeContainer}>
                <span className={styles.signupResendText}>Not received your code?</span>
                {canResend ? (
                  <button className={styles.signupResendCodeButton} onClick={handleResendOtp} type="button">
                    Resend code
                  </button>
                ) : (
                  <span className={styles.signupResendTimer}>{resendTimer}</span>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
