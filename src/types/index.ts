import type { StaticImageData } from 'next/image';

export interface Product {
  id: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  originalPrice?: number;
  emoji: string;
  images?: (StaticImageData | string)[];
  // Category doc id (slug) in the admin's `categories` collection — an open set,
  // not limited to the static catalog's 4 seeded categories. Resolve to a display
  // name via useLiveCategories(), don't render this raw value directly.
  category: string;
  badge?: 'Popular' | 'New' | 'Best Seller';
  stock: 'ready' | 'habis' | 'open_po';
  stockQty?: number;
  gradient: string;
  bgColor: string;
  weight: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  note: string;
  deliveryMethod: 'pickup' | 'delivery';
}

export type Category = 'semua' | string;
