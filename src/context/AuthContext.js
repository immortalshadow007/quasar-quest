"use client";

import React, { createContext, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Function to start the logout timer
  const startLogoutTimer = (expiryTime) => {
    const currentTime = Date.now();
    const timeoutDuration = expiryTime - currentTime;

    if (timeoutDuration > 0) {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      logoutTimerRef.current = setTimeout(() => {
        setIsAuthenticated(false);
      // Redirect to login page or perform any additional logout logic
        router.push('/account/login');
      }, timeoutDuration);
    } else {
      // If the expiry time has already passed
      setIsAuthenticated(false);
      router.push('/account/login');
    }
  };

  // Check authentication status on mount and start the logout timer
  useEffect(() => {
    const checkAuthStatus = async () => {
      const uid = Cookies.get('uid');
      setIsAuthenticated(!!uid);
      setLoading(false);
    };
    checkAuthStatus();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [pathname]);

  // Clear timers and session expiry when the user logs out manually
  useEffect (() => {
    if (!isAuthenticated) {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    }
  }, [isAuthenticated]);

  // Check authentication status on mount
  useEffect(() => {
    const uid = Cookies.get('uid');
    setIsAuthenticated(!!uid);
  }, [pathname]);

  // Synchronize logout across tabs using BroadcastChannel
  useEffect (() => {
    const channel = new BroadcastChannel('auth');

    channel.onmessage = (message) => {
      if (message.data === 'logout') {
        setIsAuthenticated(false);
        router.push('/')
      } else if (message.data.type === 'login') {
        setIsAuthenticated(true);
      }
    };
    return () => {
      channel.close();
    };
  }, []);


  // Function to handle user login
  const login = () => {
    setIsAuthenticated(true);
  };

  // Function to handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('uid', { path: '/' });
    router.push('/account/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
