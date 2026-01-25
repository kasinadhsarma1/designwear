import { NextResponse } from 'next/server';

export async function GET() {
    const envContent = `# GoKwik Configuration
GOKWIK_MERCHANT_ID=19w2ztg5723j
GOKWIK_API_KEY=your_api_key_here
GOKWIK_ENVIRONMENT=sandbox

# Sanity Configuration
SANITY_PROJECT_ID=jh7llku7
SANITY_DATASET=production

# App Configuration
APP_NAME=Design Wear
DEBUG_MODE=true

# Google AI Studio - Gemini API (Virtual Try-On)
# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=AIzaSyBMU6oSXsIRQ2xs1ERGHCm308xA8x-gCBo

# Firebase Configuration
FIREBASE_PROJECT_ID=designwear-app-8984
FIREBASE_MESSAGING_SENDER_ID=653328426569
FIREBASE_STORAGE_BUCKET=designwear-app-8984.firebasestorage.app

# Web/Windows
FIREBASE_WEB_API_KEY=AIzaSyANcu7nVVDJdGG462XPljYLlX0aTlAiUhE
FIREBASE_WEB_APP_ID=1:653328426569:web:005abd63cc23b9a7628198
FIREBASE_WINDOWS_APP_ID=1:653328426569:web:62bd79abd96884a9628198

# Android
FIREBASE_ANDROID_API_KEY=AIzaSyDNWo106_KVF81LeWH-DoQOsC0ku-8fsB8
FIREBASE_ANDROID_APP_ID=1:653328426569:android:c97bfb5c89a60f72628198

# iOS/macOS
FIREBASE_IOS_API_KEY=AIzaSyDcyc3GmnhEwws1xLK03jZ5prT_gmUvtPI
FIREBASE_IOS_APP_ID=1:653328426569:ios:d2ac17e1f0c1d01c628198
`;

    return new NextResponse(envContent, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}
