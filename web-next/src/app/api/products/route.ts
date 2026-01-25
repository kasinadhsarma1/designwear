import { NextRequest, NextResponse } from 'next/server';
import { sanityService } from '@/services/sanity';
import type { ApiResponse, Product } from '@/types';

export async function GET() {
  try {
    const products = await sanityService.fetchProducts();
    
    const response: ApiResponse<Product[]> = {
      data: products,
      success: true,
      message: `Fetched ${products.length} products successfully`
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Product[]> = {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST endpoint for creating/updating products (if needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Here you would implement product creation/update logic
    // For now, return a placeholder response
    
    const response: ApiResponse<Product> = {
      data: body,
      success: true,
      message: 'Product operation completed'
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Product> = {
      data: {} as Product,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}