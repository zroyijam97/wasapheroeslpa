import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Create stripe_settings and chip_settings tables if they don't exist
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create stripe_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stripe_settings (
        id SERIAL PRIMARY KEY,
        secret_key TEXT NOT NULL,
        publishable_key TEXT NOT NULL,
        webhook_secret TEXT NOT NULL,
        webhook_endpoint TEXT NOT NULL,
        mode VARCHAR(10) NOT NULL CHECK (mode IN ('test', 'live')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create chip_settings table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS chip_settings (
        id SERIAL PRIMARY KEY,
        brand_id TEXT NOT NULL,
        secret_key TEXT NOT NULL,
        mode VARCHAR(10) NOT NULL CHECK (mode IN ('test', 'live')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create transactions table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'MYR',
        description TEXT,
        payment_method VARCHAR(20),
        selected_bank TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'failed', 'cancelled')),
        purchase_id TEXT,
        checkout_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index on email and phone_number for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
    `);
    
    console.log('Database tables initialized successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

// Save transaction to database
export async function saveTransaction(transaction: {
  email: string;
  fullName: string;
  phoneNumber: string;
  amount: number;
  description?: string;
  paymentMethod?: string;
  selectedBank?: string;
  purchaseId?: string;
  checkoutUrl?: string;
}) {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO transactions (email, full_name, phone_number, amount, description, payment_method, selected_bank, purchase_id, checkout_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [transaction.email, transaction.fullName, transaction.phoneNumber, transaction.amount, transaction.description, transaction.paymentMethod, transaction.selectedBank, transaction.purchaseId, transaction.checkoutUrl]
    );
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error saving transaction to database:', error);
    throw error;
  }
}

// Get all transactions from database
export async function getTransactions() {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM transactions ORDER BY created_at DESC'
    );
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error getting transactions from database:', error);
    throw error;
  }
}

// Update transaction status
export async function updateTransactionStatus(id: number, status: string) {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
}

// Save Stripe settings to database
export async function saveStripeSettings(settings: {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  webhookEndpoint: string;
  mode: string;
}) {
  try {
    const client = await pool.connect();
    
    // Delete existing settings (we only keep one set of settings)
    await client.query('DELETE FROM stripe_settings');
    
    // Insert new settings
    const result = await client.query(
      `INSERT INTO stripe_settings (secret_key, publishable_key, webhook_secret, webhook_endpoint, mode) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [settings.secretKey, settings.publishableKey, settings.webhookSecret, settings.webhookEndpoint, settings.mode]
    );
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error saving Stripe settings to database:', error);
    throw error;
  }
}

// Get Stripe settings from database
export async function getStripeSettings() {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM stripe_settings ORDER BY updated_at DESC LIMIT 1'
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return {
        secretKey: '',
        publishableKey: '',
        webhookSecret: '',
        webhookEndpoint: '',
        mode: 'test'
      };
    }
    
    const row = result.rows[0];
    return {
      secretKey: row.secret_key,
      publishableKey: row.publishable_key,
      webhookSecret: row.webhook_secret,
      webhookEndpoint: row.webhook_endpoint,
      mode: row.mode
    };
  } catch (error) {
    console.error('Error getting Stripe settings from database:', error);
    throw error;
  }
}

// Save CHIP settings to database
export async function saveChipSettings(settings: {
  brandId: string;
  secretKey: string;
  mode: string;
}) {
  try {
    const client = await pool.connect();
    
    // Delete existing settings (we only keep one set of settings)
    await client.query('DELETE FROM chip_settings');
    
    // Insert new settings
    const result = await client.query(
      `INSERT INTO chip_settings (brand_id, secret_key, mode) 
       VALUES ($1, $2, $3) RETURNING *`,
      [settings.brandId, settings.secretKey, settings.mode]
    );
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error saving CHIP settings to database:', error);
    throw error;
  }
}

// Get CHIP settings from database
export async function getChipSettings() {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM chip_settings ORDER BY updated_at DESC LIMIT 1'
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return {
        brandId: '',
        secretKey: '',
        mode: 'test'
      };
    }
    
    const row = result.rows[0];
    return {
      brandId: row.brand_id,
      secretKey: row.secret_key,
      mode: row.mode
    };
  } catch (error) {
    console.error('Error getting CHIP settings from database:', error);
    throw error;
  }
}

// Create or get user from successful transaction
export async function createOrGetUser(email: string, fullName: string, phoneNumber: string) {
  try {
    const client = await pool.connect();
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1 OR phone_number = $2',
      [email, phoneNumber]
    );
    
    if (existingUser.rows.length > 0) {
      client.release();
      return existingUser.rows[0];
    }
    
    // Create new user
    const result = await client.query(
      'INSERT INTO users (email, full_name, phone_number) VALUES ($1, $2, $3) RETURNING *',
      [email, fullName, phoneNumber]
    );
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error creating or getting user:', error);
    throw error;
  }
}

// Authenticate user with email and phone number
export async function authenticateUser(email: string, phoneNumber: string) {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND phone_number = $2',
      [email, phoneNumber]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

// Get user transactions (successful ones)
export async function getUserTransactions(email: string, phoneNumber: string) {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM transactions WHERE email = $1 AND phone_number = $2 AND status = $3 ORDER BY created_at DESC',
      [email, phoneNumber, 'accepted']
    );
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    client.release();
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}