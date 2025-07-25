import { NextRequest, NextResponse } from 'next/server';
import { saveTransaction, getTransactions } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, phoneNumber, amount, description, paymentMethod, selectedBank } = body;

    if (!email || !fullName || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: 'Email, full name, phone number, and amount are required' },
        { status: 400 }
      );
    }

    const transaction = await saveTransaction({
      email,
      fullName,
      phoneNumber,
      amount,
      description,
      paymentMethod,
      selectedBank,
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}