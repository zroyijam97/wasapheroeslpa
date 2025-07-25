import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';
import { getStripeSettings, saveStripeSettings, initializeDatabase } from '@/lib/db';

// Helper function to check if user is admin
async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  
  // In a real app, you'd check the user's email from Clerk
  // For now, we'll assume the authenticated user is the admin
  return true;
}

// GET - Retrieve Stripe settings
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize database if needed
    await initializeDatabase();
    
    // Get settings from database
    const settings = await getStripeSettings();
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading Stripe settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save Stripe settings
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await request.json();
    
    // Validate required fields
    const requiredFields = ['secretKey', 'publishableKey', 'webhookSecret', 'webhookEndpoint', 'mode'];
    for (const field of requiredFields) {
      if (!settings[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate mode
    if (!['test', 'live'].includes(settings.mode)) {
      return NextResponse.json({ error: 'Invalid mode. Must be "test" or "live"' }, { status: 400 });
    }

    // Validate key formats
    const secretKeyPrefix = settings.mode === 'test' ? 'sk_test_' : 'sk_live_';
    const publishableKeyPrefix = settings.mode === 'test' ? 'pk_test_' : 'pk_live_';
    
    if (!settings.secretKey.startsWith(secretKeyPrefix)) {
      return NextResponse.json({ 
        error: `Secret key must start with ${secretKeyPrefix} for ${settings.mode} mode` 
      }, { status: 400 });
    }
    
    if (!settings.publishableKey.startsWith(publishableKeyPrefix)) {
      return NextResponse.json({ 
        error: `Publishable key must start with ${publishableKeyPrefix} for ${settings.mode} mode` 
      }, { status: 400 });
    }
    
    if (!settings.webhookSecret.startsWith('whsec_')) {
      return NextResponse.json({ 
        error: 'Webhook secret must start with whsec_' 
      }, { status: 400 });
    }

    // Initialize database if needed
    await initializeDatabase();
    
    // Save settings to database
    await saveStripeSettings(settings);
    
    // Also update environment variables file for immediate use
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add Stripe environment variables
    const stripeEnvVars = {
      'STRIPE_SECRET_KEY': settings.secretKey,
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': settings.publishableKey,
      'STRIPE_WEBHOOK_SECRET': settings.webhookSecret
    };
    
    for (const [key, value] of Object.entries(stripeEnvVars)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;
      
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, newLine);
      } else {
        envContent += `\n${newLine}`;
      }
    }
    
    fs.writeFileSync(envPath, envContent);
    
    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving Stripe settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}