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
