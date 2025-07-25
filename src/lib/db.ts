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

// Create stripe_settings table if it doesn't exist
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
    
    console.log('Database tables initialized successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
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