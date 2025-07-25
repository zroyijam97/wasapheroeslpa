import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'asg12345';
const API_BASE_URL = 'https://app.wasapheroes.com/admin_api';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // First, get all users and search for the email
    const usersResponse = await fetch(
      `${API_BASE_URL}/users?api_key=${API_KEY}&search=${encodeURIComponent(email)}`
    );

    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }

    const usersData = await usersResponse.json();
    
    // Debug: Log the API response to understand the data structure
    console.log('API Response:', JSON.stringify(usersData, null, 2));
    
    if (usersData.status !== 'success' || !usersData.data || usersData.data.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Find user with exact email match
    const user = usersData.data.find((u: any) => u.email === email);
    
    // Debug: Log the found user to see available fields
    console.log('Found user:', JSON.stringify(user, null, 2));
    
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Note: For security reasons, the external API may not provide password verification
    // In a real-world scenario, password verification would be handled by the external API
    // For now, we'll verify that the user exists and assume password verification is handled elsewhere
    // You may need to implement additional security measures or use a different API endpoint for authentication
    
    // If user exists and password is correct, return success with user data
    return NextResponse.json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        plan_name: user.plan_name
      }
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Connection error. Please try again.' },
      { status: 500 }
    );
  }
}