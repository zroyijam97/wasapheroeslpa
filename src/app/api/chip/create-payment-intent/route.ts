import { NextRequest, NextResponse } from 'next/server';
import { chip } from '../../../../lib/chip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'MYR',
      description,
      clientEmail,
      clientName,
      successRedirect,
      failureRedirect,
      cancelRedirect,
      paymentMethodWhitelist,
      metadata = {},
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be greater than 0' },
        { status: 400 }
      );
    }

    // Create payment intent using CHIP
    const paymentIntent = await chip.createPurchase({
      amount,
      currency,
      description,
      clientEmail,
      clientName,
      successRedirect,
      failureRedirect,
      cancelRedirect,
      paymentMethodWhitelist,
      metadata,
    });

    return NextResponse.json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    console.error('Error creating CHIP payment intent:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const purchaseId = searchParams.get('id');

  if (!purchaseId) {
    return NextResponse.json(
      { error: 'Purchase ID is required' },
      { status: 400 }
    );
  }

  try {
    const purchase = await chip.retrievePurchase(purchaseId);
    return NextResponse.json({
      success: true,
      purchase,
    });
  } catch (error) {
    console.error('Error retrieving CHIP purchase:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve purchase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}