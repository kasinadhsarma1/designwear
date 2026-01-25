// TypeScript types that mirror the Dart models
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  stockStatus: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  customDesign?: CustomDesign;
}

export interface Cart {
  id: string;
  items: CartItem[];
  userId?: string;
  totalAmount: number;
  taxAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomDesign {
  id: string;
  name: string;
  description: string;
  designData: string; // JSON string containing design information
  imageUrl?: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: string;
  lastLoginAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Configuration interfaces
export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export interface AppConfig {
  sanity: SanityConfig;
  appName: string;
  isDebug: boolean;
}