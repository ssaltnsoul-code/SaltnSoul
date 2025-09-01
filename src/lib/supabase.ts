import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using mock data.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          original_price?: number;
          image: string;
          category: string;
          sizes: string[];
          colors: string[];
          in_stock: boolean;
          featured: boolean;
          stock_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          original_price?: number;
          image: string;
          category: string;
          sizes: string[];
          colors: string[];
          in_stock?: boolean;
          featured?: boolean;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          original_price?: number;
          image?: string;
          category?: string;
          sizes?: string[];
          colors?: string[];
          in_stock?: boolean;
          featured?: boolean;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_email: string;
          customer_name: string;
          customer_address: string;
          customer_city: string;
          customer_state: string;
          customer_zip: string;
          total: number;
          status: string;
          payment_intent_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_email: string;
          customer_name: string;
          customer_address: string;
          customer_city: string;
          customer_state: string;
          customer_zip: string;
          total: number;
          status?: string;
          payment_intent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_email?: string;
          customer_name?: string;
          customer_address?: string;
          customer_city?: string;
          customer_state?: string;
          customer_zip?: string;
          total?: number;
          status?: string;
          payment_intent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          size: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          size: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          size?: string;
          color?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row']; 