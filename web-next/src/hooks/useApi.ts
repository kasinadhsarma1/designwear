// Client-side React hooks for data fetching
// These can be used in your Next.js components to fetch data from the API

'use client';

import { useState, useEffect } from 'react';
import type { Product, Category, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic API fetch function
async function fetchAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

// Custom hooks for data fetching
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetchAPI<Product[]>('/products');
        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const response = await fetchAPI<Category[]>('/categories');
        if (response.success) {
          setCategories(response.data);
        } else {
          setError(response.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        const response = await fetchAPI<Product>(`/products/${productId}`);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError(response.error || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  return { product, loading, error };
}

export function useProductsByCategory(categoryId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetchAPI<Product[]>(`/categories/${categoryId}/products`);
        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [categoryId]);

  return { products, loading, error };
}

export function useTaxRate() {
  const [taxRate, setTaxRate] = useState<number>(18.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTaxRate() {
      try {
        setLoading(true);
        const response = await fetchAPI<{ taxRate: number }>('/settings/tax-rate');
        if (response.success) {
          setTaxRate(response.data.taxRate);
        } else {
          setError(response.error || 'Failed to fetch tax rate');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadTaxRate();
  }, []);

  return { taxRate, loading, error };
}