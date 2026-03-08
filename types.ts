export enum OrderStatus {
  PLACED = 'Placed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed'
}

export enum UserRole {
  GUEST = 'Guest',
  MEMBER = 'Member',
  ADMIN = 'Admin'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  reviews: Review[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Address {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  role?: UserRole;
  verified: boolean;
  orderCount: number;
  address?: string;
  addresses?: Address[];
  isAdmin?: boolean;
  isVerified?: boolean;
  cart?: any[];
  wishlist?: Product[] | string[];
}

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email?: string;
}

export interface Order {
  _id: string;
  id?: string; // Legacy
  user?: any; // Populated user object or ID
  userId?: string; // Legacy
  userName?: string; // Legacy
  userRole?: UserRole; // Legacy

  orderItems: OrderItem[];
  items?: CartItem[]; // Legacy

  shippingAddress: ShippingAddress;
  address?: string; // Legacy

  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };

  itemsPrice: number;
  total?: number; // Legacy

  taxPrice: number;

  shippingPrice: number;
  shipping?: number; // Legacy

  totalPrice: number;
  grandTotal?: number; // Legacy

  isPaid: boolean;
  paidAt?: string;

  isDelivered: boolean;
  deliveredAt?: string;

  status: OrderStatus; // String in backend, mapped to enum here
  
  invoiceNumber?: string;
  invoiceId?: string; // Legacy
  
  createdAt: string;
}

export interface Ticket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  adminResponse?: string;
}

export interface AppState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isSearching: boolean;
}
