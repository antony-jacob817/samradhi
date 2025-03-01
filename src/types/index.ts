export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Seeds' | 'Saplings' | 'Pesticides' | 'Fertilizers';
  imageUrl: string;
  krishiBhavan: 'Krishi Bahavan 1' | 'Krishi Bahavan 2';
  stock: number;
  officeId: string;
}

export interface Office {
  id: string;
  name: string;
  location: string;
  address: string;
  contact: string;
}

export interface Booking {
  id: string;
  productId: string;
  userId: string;
  officeId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'collected' | 'expired';
  bookingDate: Date;
  expiryDate: Date;
  product: Product;
  office: Office;
  totalAmount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  office: Office;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'seller';
  address: string;
  pincode: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}