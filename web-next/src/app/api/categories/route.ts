import { NextRequest, NextResponse } from 'next/server';
import { sanityService } from '@/services/sanity';
import type { ApiResponse, Category } from '@/types';

export async function GET() {
  try {
    const categories = await sanityService.fetchCategories();
    
    const response: ApiResponse<Category[]> = {
      data: categories,
      success: true,
      message: `Fetched ${categories.length} categories successfully`
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<Category[]> = {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}