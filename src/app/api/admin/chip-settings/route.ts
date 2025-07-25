import { NextRequest, NextResponse } from 'next/server';
import { saveChipSettings, getChipSettings, initializeDatabase } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('Getting CHIP settings...');
    await initializeDatabase();
    const settings = await getChipSettings();
    console.log('Retrieved CHIP settings:', settings);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error getting CHIP settings:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    console.log('Received CHIP settings:', settings);

    // Validate required fields
    const requiredFields = ['brandId', 'secretKey', 'mode'];
    for (const field of requiredFields) {
      if (!settings[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate mode
    if (!['test', 'live'].includes(settings.mode)) {
      return NextResponse.json(
        { error: 'Mode must be either "test" or "live"' },
        { status: 400 }
      );
    }



    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Saving CHIP settings to database...');
    await saveChipSettings(settings);

    // Update .env.local file
    console.log('Updating .env.local file...');
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
      console.log('.env.local file not found, creating new one');
    }

    // Update or add CHIP environment variables
    const chipEnvVars = {
      CHIP_BRAND_ID: settings.brandId,
      CHIP_SECRET_KEY: settings.secretKey,
      CHIP_MODE: settings.mode,
    };

    let updatedEnvContent = envContent;
    
    for (const [key, value] of Object.entries(chipEnvVars)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;
      
      if (regex.test(updatedEnvContent)) {
        updatedEnvContent = updatedEnvContent.replace(regex, newLine);
      } else {
        updatedEnvContent += `\n${newLine}`;
      }
    }

    fs.writeFileSync(envPath, updatedEnvContent);
    console.log('Environment variables updated successfully');

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving CHIP settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}