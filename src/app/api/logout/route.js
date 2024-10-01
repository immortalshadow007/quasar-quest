// File: route.js (logout)

import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Get cookies from the request
    const cookiesStore = cookies();
    const sessionToken = cookiesStore.get('session_token');

    // Create a headers object including the session_token cookie
    const headers = {
      'Content-Type': 'application/json',
    };

    if (sessionToken) {
      headers['Cookie'] = `session_token=${sessionToken.value}`;
    } else {
      console.log('No session_token cookie found');
    }

    // Call the backend to invalidate the session
    const response = await axios.get(`${process.env.SESSION_API_URL}terminate-session/`, {
      headers: headers,
    });

    console.log('Response from backend:', response.data);

    // Create a response object
    const res = NextResponse.json({ success: true });

    // Clear the 'uid' and 'session_token' cookies
    res.cookies.set('uid', '', {
      expires: new Date(0),
      path: '/',
    });
    res.cookies.set('session_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
    });

    return res;
  } catch (error) {
    console.error('Error in logout API route:', error);
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}
