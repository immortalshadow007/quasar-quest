"use client";

import React, { createContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setLoading } from '../store/slices/authSlices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
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
        dispatch(logout());
        router.push('/account/login');
      }, timeoutDuration);
    } else {
      dispatch(logout());
      router.push('/account/login');
    }
  };

  // Check authentication status on mount and start the logout timer
  useEffect(() => {
    const checkAuthStatus = async () => {
      const uid = Cookies.get('uid');
      dispatch(setLoading(false));
      if (uid) {
        dispatch(login());
      }
    };
    checkAuthStatus();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [pathname, dispatch]);

  // Clear timers and session expiry when the user logs out manually
  useEffect (() => {
    if (!isAuthenticated) {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    }
  }, [isAuthenticated]);

  // Synchronize logout across tabs using BroadcastChannel
  useEffect (() => {
    const channel = new BroadcastChannel('auth');

    channel.onmessage = (message) => {
      if (message.data === 'logout') {
        dispatch(logout());
        router.push('/')
      } else if (message.data.type === 'login') {
        dispatch(login());
      }
    };
    return () => {
      channel.close();
    };
  }, [dispatch, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
