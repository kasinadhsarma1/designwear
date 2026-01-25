#!/bin/bash

# Build script to integrate Flutter web with Next.js

set -e

echo "🚀 Building Flutter web app for Next.js integration..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Build Flutter web app
echo "📦 Building Flutter web..."
flutter build web --release

# Create Flutter assets directory in Next.js public folder
FLUTTER_ASSETS_DIR="web-next/public/flutter-assets"
rm -rf "$FLUTTER_ASSETS_DIR"
mkdir -p "$FLUTTER_ASSETS_DIR"

# Copy Flutter web build to Next.js public folder
echo "📋 Copying Flutter assets to Next.js..."
cp -r build/web/* "$FLUTTER_ASSETS_DIR/"

# Create Flutter app page for Next.js
FLUTTER_APP_DIR="web-next/public/flutter-app"
mkdir -p "$FLUTTER_APP_DIR"
cp "$FLUTTER_ASSETS_DIR/index.html" "$FLUTTER_APP_DIR/index.html"

# Update asset paths in Flutter files to work with Next.js
echo "🔧 Updating asset paths..."

# Update main.dart.js to use correct asset base
if [ -f "$FLUTTER_ASSETS_DIR/main.dart.js" ]; then
    sed -i 's|assetBase:""|assetBase:"/flutter-assets/"|g' "$FLUTTER_ASSETS_DIR/main.dart.js"
fi

# Create Next.js API route for Flutter communication
mkdir -p "web-next/src/app/api/flutter"
cat > "web-next/src/app/api/flutter/route.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

// API route for Flutter communication
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Handle Flutter messages here
    console.log('Received Flutter message:', data);
    
    // Echo back for now - implement your logic here
    return NextResponse.json({
      success: true,
      message: 'Message received from Flutter',
      echo: data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process Flutter message'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Flutter API ready',
    timestamp: new Date().toISOString()
  });
}
EOF

echo "✅ Flutter web integration complete!"
echo "📂 Flutter assets copied to: $FLUTTER_ASSETS_DIR"
echo "🌐 Flutter app available at: /flutter-app/"
echo "🔗 API endpoint available at: /api/flutter"