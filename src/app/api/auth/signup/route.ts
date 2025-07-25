import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'asg12345';
const API_BASE_URL = 'https://app.wasapheroes.com/admin_api';

export async function POST(request: NextRequest) {
  try {
    const { username, fullname, email, password } = await request.json();
    
    if (!username || !fullname || !email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Make API call to create user
    const response = await fetch(`${API_BASE_URL}/users?api_key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        fullname,
        email,
        password,
        expired_date: '01-12-2025', // Default 1 year
        timezone: 'Asia/Kuala_Lumpur',
        plan_id: 7, // Unlimited plan
        is_admin: 0,
        status: 2
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Connection error. Please try again.' },
      { status: 500 }
    );
  }
}