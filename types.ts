
import React from 'react';

export type ItemType = 'Tradicional' | 'Especial' | 'Doce' | 'Borda' | 'Bebida';

export interface RestaurantInfo {
  name: string;
  logoUrl?: string;
  tagline: string;
  address?: string;
  deliveryLink?: string;
  contact: {
    whatsapp: string;
    ifoodLink: string;
  };
  socialMedia: {
    instagram: string;
  };
}

export interface MenuItem {
  id: string;
  name:string;
  description: string;
  price: number;
  trioPrice: number;
  imageUrl: string;
  isAvailable: boolean;
  category: string;
  itemType: ItemType;
}

export interface CartItem {
  id: string; // original menu item ID
  cartItemId: string; // unique ID for this cart entry
  name: string;
  quantity: number;
  price: number; // The final price for this item (single or trio)
  isTrio: boolean;
  sauce?: 'Alho' | 'Especial';
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: React.ReactNode; 
  description?: string; 
}

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
    expiryDate?: string; // YYYY-MM-DD
    minOrderValue?: number;
}

export interface Category {
    id: string;
    name: string;
    price?: string;
}

export interface Review {
    id:string;
    name: string;
    rating: number; // e.g., 5
    comment: string;
}

// Auth related types
export type AuthView = 'login' | 'register' | 'verifyEmail';

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendVerificationEmail: (email: string) => Promise<string | null>;
  verifyEmailCode: (email: string, code: string) => Promise<boolean>;
  clearAuthError: () => void;
}