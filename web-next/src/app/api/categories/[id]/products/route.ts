import { NextRequest, NextResponse } from 'next/server';
import { sanityService } from '@/services/sanity';
import type { ApiResponse, Product } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      const response: ApiResponse<Product[]> = {
        data: [],
        success: false,
        error: 'Category ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const products = await sanityService.fetchProductsByCategory(id);
    
    const response: ApiResponse<Product[]> = {
      data: products,
      success: true,
      message: `Fetched ${products.length} products for category ${id}`
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