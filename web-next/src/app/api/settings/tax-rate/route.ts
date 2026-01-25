import { NextRequest, NextResponse } from 'next/server';
import { sanityService } from '@/services/sanity';
import type { ApiResponse } from '@/types';

export async function GET() {
  try {
    const taxRate = await sanityService.fetchTaxRate();
    
    const response: ApiResponse<{ taxRate: number }> = {
      data: { taxRate },
      success: true,
      message: 'Tax rate fetched successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<{ taxRate: number }> = {
      data: { taxRate: 18.0 }, // Default tax rate
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}