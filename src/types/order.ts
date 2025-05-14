// Order and cart related types
import { Book } from "./book";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// Individual order item
export interface OrderItem {
  id: string;
  bookId: string;
  book?: Book;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Complete order details
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: Date;
  };
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

// Shopping cart
export interface CartItem {
  bookId: string;
  book?: Book;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}
