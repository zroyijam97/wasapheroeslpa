import { NextRequest, NextResponse } from 'next/server';
import { stripe, createCustomer, createSubscription } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      priceId,
      paymentMethodId,
      trialPeriodDays,
      metadata
    } = await request.json();

    if (!email || !priceId) {
      return NextResponse.json(
        { error: 'Email and priceId are required' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create new customer
      customer = await createCustomer({
        email,
        name,
        metadata: metadata || {},
      });
    }

    // Attach payment method to customer if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
    }

    // Create subscription
    const subscription = await createSubscription({
      customerId: customer.id,
      priceId,
      paymentMethodId,
      trialPeriodDays,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      customerId: customer.id,
      clientSecret: (subscription.latest_invoice as Stripe.Invoice & { payment_intent?: { client_secret?: string } })?.payment_intent?.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}