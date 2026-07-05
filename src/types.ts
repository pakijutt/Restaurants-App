export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: 'burgers' | 'pizza' | 'wraps' | 'fries' | 'drinks' | 'sides';
  rating?: number;
  isBestSeller?: boolean;
  isSizzling?: boolean;
  isNew?: boolean;
  badgeText?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customization?: string;
}

export interface UserProfile {
  name: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  points: number;
  profilePic: string;
  phone: string;
  address: string;
  uid?: string;
  email?: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'received' | 'preparing' | 'shipping' | 'arrived';
  riderName: string;
  riderRating: number;
  riderPic: string;
  etaMinutes: number;
  date: string;
}

export type NavigationTab = 'home' | 'menu' | 'deals' | 'search' | 'cart' | 'track' | 'profile' | 'admin';
