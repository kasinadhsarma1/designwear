import { createClient } from '@sanity/client';
import { defaultConfig, isConfigured } from '@/config/app';
import type { Product, Category } from '@/types';

// Initialize Sanity client only if properly configured
const client = isConfigured ? createClient({
  projectId: defaultConfig.sanity.projectId,
  dataset: defaultConfig.sanity.dataset,
  apiVersion: defaultConfig.sanity.apiVersion,
  useCdn: false, // Set to true for production
}) : null;

// Service class that mirrors the Dart SanityService
export class SanityService {
  private client = client;

  private checkConfiguration(): boolean {
    if (!this.client) {
      console.warn('⚠️  Sanity client not configured. Please set SANITY_PROJECT_ID in your .env.local file.');
      return false;
    }
    return true;
  }

  async fetchProducts(): Promise<Product[]> {
    if (!this.checkConfiguration()) {
      // Return mock data for development
      return this.getMockProducts();
    }

    try {
      const query = `
        *[_type == "product"]{
          "id": _id,
          title,
          slug,
          description,
          price,
          "imageUrl": image.asset->url,
          "categoryId": category._ref,
          "stockStatus": stock
        }
      `;
      const result = await this.client!.fetch(query);
      return result || [];
    } catch (error) {
      console.error('Sanity fetch failed:', error);
      return this.getMockProducts();
    }
  }

  async fetchCategories(): Promise<Category[]> {
    if (!this.checkConfiguration()) {
      return this.getMockCategories();
    }

    try {
      const query = `
        *[_type == "category"]{
          "id": _id,
          title,
          slug,
          description,
          "imageUrl": image.asset->url
        }
      `;
      const result = await this.client!.fetch(query);
      return result || [];
    } catch (error) {
      console.error('Sanity fetch failed:', error);
      return this.getMockCategories();
    }
  }

  async fetchProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!this.checkConfiguration()) {
      return this.getMockProducts().filter(p => p.categoryId === categoryId);
    }

    try {
      const query = `
        *[_type == "product" && category._ref == $categoryId]{
          "id": _id,
          title,
          slug,
          description,
          price,
          "imageUrl": image.asset->url,
          "categoryId": category._ref,
          "stockStatus": stock
        }
      `;
      const result = await this.client!.fetch(query, { categoryId });
      return result || [];
    } catch (error) {
      console.error('Sanity fetch failed:', error);
      return this.getMockProducts().filter(p => p.categoryId === categoryId);
    }
  }

  async fetchProductById(productId: string): Promise<Product | null> {
    if (!this.checkConfiguration()) {
      return this.getMockProducts().find(p => p.id === productId) || null;
    }

    try {
      const query = `
        *[_type == "product" && _id == $productId][0]{
          "id": _id,
          title,
          slug,
          description,
          price,
          "imageUrl": image.asset->url,
          "categoryId": category._ref,
          "stockStatus": stock
        }
      `;
      const result = await this.client!.fetch(query, { productId });
      return result || null;
    } catch (error) {
      console.error('Sanity fetch failed:', error);
      return this.getMockProducts().find(p => p.id === productId) || null;
    }
  }

  async fetchTaxRate(): Promise<number> {
    if (!this.checkConfiguration()) {
      return 18.0;
    }

    try {
      const query = '*[_type == "settings"][0].taxRate';
      const result = await this.client!.fetch(query);
      return result || 18.0;
    } catch (error) {
      console.error('Sanity fetch failed. Returning default tax rate:', error);
      return 18.0;
    }
  }

  // Mock data for development when Sanity is not configured
  private getMockProducts(): Product[] {
    return [
      {
        id: 'mock-product-1',
        title: 'Classic T-Shirt',
        slug: 'classic-t-shirt',
        description: 'A comfortable cotton t-shirt perfect for everyday wear.',
        price: 29.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=T-Shirt',
        categoryId: 'mock-category-1',
        stockStatus: 'inStock'
      },
      {
        id: 'mock-product-2',
        title: 'Designer Hoodie',
        slug: 'designer-hoodie',
        description: 'Premium quality hoodie with custom design options.',
        price: 79.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Hoodie',
        categoryId: 'mock-category-1',
        stockStatus: 'inStock'
      },
      {
        id: 'mock-product-3',
        title: 'Custom Cap',
        slug: 'custom-cap',
        description: 'Adjustable cap with embroidery customization.',
        price: 24.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Cap',
        categoryId: 'mock-category-2',
        stockStatus: 'inStock'
      }
    ];
  }

  private getMockCategories(): Category[] {
    return [
      {
        id: 'mock-category-1',
        title: 'Apparel',
        slug: 'apparel',
        description: 'Clothing items including t-shirts, hoodies, and more.',
        imageUrl: 'https://via.placeholder.com/300x300?text=Apparel'
      },
      {
        id: 'mock-category-2',
        title: 'Accessories',
        slug: 'accessories',
        description: 'Fashion accessories like caps, bags, and jewelry.',
        imageUrl: 'https://via.placeholder.com/300x300?text=Accessories'
      }
    ];
  }
}

// Export singleton instance
export const sanityService = new SanityService();