import { NextResponse } from 'next/server';
import { testConnection, initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to connect to database' 
      }, { status: 500 });
    }
    
    // Initialize database tables
    const isInitialized = await initializeDatabase();
    
    if (!isInitialized) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to initialize database tables' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful and tables initialized',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}