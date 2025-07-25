import { NextRequest, NextResponse } from 'next/server';
import { updateTransactionStatus } from '../../../../lib/db';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transactionId = parseInt(params.id);

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, purchaseId, checkoutUrl } = body;
    const transactionId = parseInt(params.id);

    if (isNaN(transactionId)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    let query = 'UPDATE transactions SET updated_at = CURRENT_TIMESTAMP';
    const values: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += `, status = $${paramCount}`;
      values.push(status);
    }

    if (purchaseId) {
      paramCount++;
      query += `, purchase_id = $${paramCount}`;
      values.push(purchaseId);
    }

    if (checkoutUrl) {
      paramCount++;
      query += `, checkout_url = $${paramCount}`;
      values.push(checkoutUrl);
    }

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(transactionId);

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}