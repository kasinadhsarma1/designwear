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
      const response: ApiResponse<Product> = {
        data: {} as Product,
        success: false,
        error: 'Product ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const product = await sanityService.fetchProductById(id);
    
    if (!product) {
      const response: ApiResponse<Product> = {
        data: {} as Product,
        success: false,
        error: 'Product not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      data: product,
      success: true,
      message: 'Product fetched successfully'
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