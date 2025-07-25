import { NextRequest, NextResponse } from 'next/server';
import { createOrGetUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, phoneNumber } = await request.json();

    if (!email || !fullName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Email, full name, and phone number are required' },
        { status: 400 }
      );
    }

    // Create or get existing user
    const user = await createOrGetUser(email, fullName, phoneNumber);

    // Return user data for session
    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Error in auto-login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}