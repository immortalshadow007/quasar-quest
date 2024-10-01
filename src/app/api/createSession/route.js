// src/app/api/createSession/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const { mobile_number, mobile_number_hash } = await request.json();

    const csrfResponse = await axios.get(`${process.env.SESSION_API_URL}get-csrf-token/`, {
      withCredentials: true,
    });

    const { csrfToken } =csrfResponse.data;

    // Call the session management service
    const sessionResponse = await axios.post(
      `${process.env.SESSION_API_URL}create-session/`,
      { 
        mobile_number,
        mobile_number_hash
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      }
    );

    if (sessionResponse.status === 200) {
      const { session_token, uid } = sessionResponse.data;

      // Create a NextResponse object
      const response = NextResponse.json({ success: true, uid: uid });

      // Get Set-Cookie headers from the backend response
      const setCookieHeaders = sessionResponse.headers['set-cookie'];
      if (setCookieHeaders) {
        setCookieHeaders.forEach((cookie) => {
          response.headers.append('Set-Cookie', cookie);
        });
      }

      return response;
    } else {
      console.error('Session creation failed with status:', sessionResponse.status);
      return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in createSession API route:', error);
    return NextResponse.json({ error: 'An error occurred during session creation' }, { status: 500 });
  }
}
