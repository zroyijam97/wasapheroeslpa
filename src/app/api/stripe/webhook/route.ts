import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Handle successful payment
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment
        await handlePaymentFailure(failedPayment);
        break;

      case 'customer.subscription.created':
        const newSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', newSubscription.id);
        // Handle new subscription
        await handleSubscriptionCreated(newSubscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', updatedSubscription.id);
        // Handle subscription update
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', deletedSubscription.id);
        // Handle subscription cancellation
        await handleSubscriptionCancelled(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        // Handle successful recurring payment
        await handleInvoicePaymentSuccess(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', failedInvoice.id);
        // Handle failed recurring payment
        await handleInvoicePaymentFailure(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Helper functions to handle different events
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Update your database with successful payment
  // Send confirmation email
  // Update user's account status
  console.log('Processing successful payment:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customer: paymentIntent.customer,
  });
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  // Handle failed payment
  // Send notification to user
  // Log the failure
  console.log('Processing failed payment:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customer: paymentIntent.customer,
    last_payment_error: paymentIntent.last_payment_error,
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Update user's subscription status in database
  // Send welcome email
  // Activate premium features
  console.log('Processing new subscription:', {
    id: subscription.id,
    customer: subscription.customer,
    status: subscription.status,
    current_period_start: (subscription as any).current_period_start,
    current_period_end: (subscription as any).current_period_end,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update subscription details in database
  // Handle plan changes
  console.log('Processing subscription update:', {
    id: subscription.id,
    customer: subscription.customer,
    status: subscription.status,
    current_period_start: (subscription as any).current_period_start,
    current_period_end: (subscription as any).current_period_end,
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  // Update user's subscription status
  // Send cancellation confirmation
  // Schedule feature deactivation
  console.log('Processing subscription cancellation:', {
    id: subscription.id,
    customer: subscription.customer,
    status: subscription.status,
    canceled_at: subscription.canceled_at,
  });
}

async function handleInvoicePaymentSuccess(invoice: Stripe.Invoice) {
  // Handle successful recurring payment
  // Extend subscription period
  // Send receipt
  const subscriptionId = (invoice as any).subscription;
  console.log('Processing successful invoice payment:', {
    id: invoice.id,
    customer: invoice.customer,
    subscription: subscriptionId,
    amount_paid: invoice.amount_paid,
    currency: invoice.currency,
  });
}

async function handleInvoicePaymentFailure(invoice: Stripe.Invoice) {
  // Handle failed recurring payment
  // Send payment failure notification
  // Implement retry logic or suspend account
  const subscriptionId = (invoice as any).subscription;
  console.log('Processing failed invoice payment:', {
    id: invoice.id,
    customer: invoice.customer,
    subscription: subscriptionId,
    amount_due: invoice.amount_due,
    currency: invoice.currency,
  });
  }