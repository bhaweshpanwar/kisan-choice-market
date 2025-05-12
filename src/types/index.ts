
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity?: number;
  unit: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  farmer: {
    name: string;
    location: string;
    image: string;
  };
  inStock: boolean;
  isNegotiable: boolean;
  isFarmerChoice?: boolean;
  isTopSelling?: boolean;
  isVerified?: boolean;
  description: string;
  highlights: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: Product[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}
