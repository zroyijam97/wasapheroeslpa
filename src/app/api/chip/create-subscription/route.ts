import { NextRequest, NextResponse } from 'next/server';
import { createSubscription } from '@/lib/chip';

export async function POST(request: NextRequest) {
  try {
    const { 
      amount,
      currency,
      description,
      email,
      name,
      clientEmail,
      clientName,
      interval,
      trialPeriodDays,
      successRedirect,
      failureRedirect,
      cancelRedirect,
      metadata 
    } = await request.json();

    // Support both email/name and clientEmail/clientName formats
    const customerEmail = email || clientEmail;
    const customerName = name || clientName;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    const subscription = await createSubscription({
      amount,
      currency: currency || 'MYR',
      description: description || 'Subscription',
      clientEmail: customerEmail,
      clientName: customerName,
      interval: interval || 'month',
      trialPeriodDays,
      successRedirect,
      failureRedirect,
      cancelRedirect,
      metadata: {
        type: 'subscription',
        ...metadata,
      },
    });

    return NextResponse.json({
      id: subscription.id,
      purchaseId: subscription.id,
      checkoutUrl: subscription.checkout_url,
      invoiceUrl: subscription.invoice_url,
      directPostUrl: subscription.direct_post_url,
      status: subscription.status,
      recurringToken: subscription.recurring_token,
      isRecurring: subscription.is_recurring_token,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}