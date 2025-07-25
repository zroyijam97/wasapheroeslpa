import { NextRequest, NextResponse } from 'next/server';
import { getUserTransactions } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phoneNumber');

    if (!email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Email and phone number are required' },
        { status: 400 }
      );
    }

    // Get user transactions
    const transactions = await getUserTransactions(email, phoneNumber);

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}