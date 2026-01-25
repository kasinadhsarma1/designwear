import { NextResponse } from 'next/server';

export async function GET() {
    const envContent = `# GoKwik Configuration
GOKWIK_MERCHANT_ID=${process.env.GOKWIK_MERCHANT_ID || '19w2ztg5723j'}
GOKWIK_API_KEY=${process.env.GOKWIK_API_KEY || ''}
GOKWIK_ENVIRONMENT=${process.env.GOKWIK_ENVIRONMENT || 'sandbox'}

# Sanity Configuration
SANITY_PROJECT_ID=${process.env.SANITY_PROJECT_ID || 'jh7llku7'}
SANITY_DATASET=${process.env.SANITY_DATASET || 'production'}

# App Configuration
APP_NAME=${process.env.APP_NAME || 'Design Wear'}
DEBUG_MODE=${process.env.DEBUG_MODE || 'true'}

# Google AI Studio - Gemini API (Virtual Try-On)
# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=${process.env.GEMINI_API_KEY || ''}

# Firebase Configuration
FIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID || 'designwear-app-8984'}
FIREBASE_MESSAGING_SENDER_ID=${process.env.FIREBASE_MESSAGING_SENDER_ID || '653328426569'}
FIREBASE_STORAGE_BUCKET=${process.env.FIREBASE_STORAGE_BUCKET || 'designwear-app-8984.firebasestorage.app'}

# Web/Windows
FIREBASE_WEB_API_KEY=${process.env.FIREBASE_WEB_API_KEY || ''}
FIREBASE_WEB_APP_ID=${process.env.FIREBASE_WEB_APP_ID || ''}
FIREBASE_WINDOWS_APP_ID=${process.env.FIREBASE_WINDOWS_APP_ID || ''}

# Android
FIREBASE_ANDROID_API_KEY=${process.env.FIREBASE_ANDROID_API_KEY || ''}
FIREBASE_ANDROID_APP_ID=${process.env.FIREBASE_ANDROID_APP_ID || ''}

# iOS/macOS
FIREBASE_IOS_API_KEY=${process.env.FIREBASE_IOS_API_KEY || ''}
FIREBASE_IOS_APP_ID=${process.env.FIREBASE_IOS_APP_ID || ''}
`;

    return new NextResponse(envContent, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}
