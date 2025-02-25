import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { AuthState, User } from '../types';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  password: string;
  role: 'customer' | 'seller';
}

export const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('http://localhost:5000/login', { email, password });


          const user: User = {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            phone: response.data.phone,
            address: response.data.address,
            pincode: response.data.pincode,
            role: response.data.role
          };
          
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Invalid credentials', isLoading: false });
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('http://localhost:5000/register', data);
          const user: User = {
            id: response.data.id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            address: data.address,
            pincode: data.pincode,
            role: data.role
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed. Please try again.', isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: false,
    }
  )
);