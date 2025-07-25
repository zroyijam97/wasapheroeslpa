import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

// CHIP webhook events we handle
const HANDLED_EVENTS = [
  'purchase.paid',
  'purchase.failed',
  'purchase.cancelled',
  'purchase.refunded',
  'recurring.charged',
  'recurring.failed',
  'recurring.cancelled',
];

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('x-signature');
    
    if (!signature) {
      console.error('No signature header found');
      return NextResponse.json(
        { error: 'No signature header' },
        { status: 400 }
      );
    }

    // Get webhook secret from environment
    const webhookSecret = process.env.CHIP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CHIP_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log('CHIP webhook event received:', event.event_type);

    // Handle different event types
    switch (event.event_type) {
      case 'purchase.paid':
        await handlePaymentSuccess(event.data);
        break;
      
      case 'purchase.failed':
        await handlePaymentFailed(event.data);
        break;
      
      case 'purchase.cancelled':
        await handlePaymentCancelled(event.data);
        break;
      
      case 'purchase.refunded':
        await handlePaymentRefunded(event.data);
        break;
      
      case 'recurring.charged':
        await handleRecurringCharged(event.data);
        break;
      
      case 'recurring.failed':
        await handleRecurringFailed(event.data);
        break;
      
      case 'recurring.cancelled':
        await handleRecurringCancelled(event.data);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Event handlers
async function handlePaymentSuccess(data: any) {
  console.log('Payment successful:', data.id);
  // TODO: Update order status, send confirmation email, etc.
  // You can add your business logic here
}

async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data.id);
  // TODO: Handle failed payment, notify customer, etc.
}

async function handlePaymentCancelled(data: any) {
  console.log('Payment cancelled:', data.id);
  // TODO: Handle cancelled payment
}

async function handlePaymentRefunded(data: any) {
  console.log('Payment refunded:', data.id);
  // TODO: Handle refund, update order status, etc.
}

async function handleRecurringCharged(data: any) {
  console.log('Recurring payment charged:', data.id);
  // TODO: Handle successful recurring payment
}

async function handleRecurringFailed(data: any) {
  console.log('Recurring payment failed:', data.id);
  // TODO: Handle failed recurring payment, retry logic, etc.
}

async function handleRecurringCancelled(data: any) {
  console.log('Recurring payment cancelled:', data.id);
  // TODO: Handle cancelled subscription
}