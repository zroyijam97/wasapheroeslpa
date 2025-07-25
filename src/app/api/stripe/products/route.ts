import { NextRequest, NextResponse } from 'next/server';
import { stripe, createSubscriptionProduct } from '@/lib/stripe';

// GET - Retrieve all products and prices
export async function GET() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    return NextResponse.json({
      products: products.data,
      prices: prices.data,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription product
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      amount,
      interval,
      currency
    } = await request.json();

    if (!name || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Name and valid amount are required' },
        { status: 400 }
      );
    }

    const { product, price } = await createSubscriptionProduct({
      name,
      description,
      amount,
      interval: interval || 'month',
      currency: currency || 'myr',
    });

    return NextResponse.json({
      product,
      price,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}