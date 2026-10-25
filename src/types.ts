export type CategoryId = 'todos' | 'pizzas' | 'fahita' | 'hamburgueres' | 'bebidas' | 'extras';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  basePrice: number; // in Angolan Kwanza (AOA)
  image: string;
  fallbackImage?: string;
  rating: number;
  ratingCount: number;
  badge?: 'MAIS VENDIDA' | 'RECOMENDAÇÃO DO CHEFE' | 'NOVIDADE' | 'OFERTA ESPECIAL' | 'VEGETARIANA';
  isPopular?: boolean;
  hasSizes?: boolean;
}

export type PizzaSize = 'media' | 'grande' | 'familia';
export type PizzaCrust = 'tradicional' | 'catupiry' | 'cheddar';

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  size?: PizzaSize;
  crust?: PizzaCrust;
  extras?: string[];
  notes?: string;
  itemPrice: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number; // Kz
  timeEstimate: string;
}

export interface Coupon {
  code: string;
  discountType: 'free_delivery' | 'percentage' | 'fixed';
  discountValue: number;
  description: string;
  minOrder: number;
}
