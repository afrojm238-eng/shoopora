import { supabase } from './supabase';
import { Product, Order } from '../types';

export const supabaseService = {
  // Products
  async getProducts(limit?: number, offset?: number): Promise<Product[]> {
    try {
      const url = limit ? `/api/products?limit=${limit}&offset=${offset || 0}` : '/api/products';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products from server');
      const data = await response.json();
      console.log('Fetched products:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.warn('Server fetch failed, falling back to direct Supabase call:', error);
      let query = supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      
      if (limit) {
        const l = limit;
        const o = offset || 0;
        query = query.range(o, o + l - 1);
      }
      
      const { data, error: sbError } = await query;
      
      if (sbError) {
        console.error('Supabase direct fetch error:', sbError);
        throw sbError;
      }
      return data || [];
    }
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    try {
      console.log('Saving product:', product.title);
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Server save error:', result);
        if (result.error && (result.error.includes("images") || result.error.includes("column"))) {
          throw new Error(`Database Error: A required column might be missing. Please run the Master SQL Fix. Details: ${result.error}`);
        }
        throw new Error(result.error || 'Failed to save product');
      }
      return result;
    } catch (error: any) {
      console.error('Supabase save error:', error);
      // Fallback to direct Supabase if API fails
      let result;
      if (product.id) {
        const { id, ...updateData } = product;
        result = await supabase.from('products').update(updateData).eq('id', id).select().single();
      } else {
        const { id, ...insertData } = product;
        result = await supabase.from('products').insert(insertData).select().single();
      }
      
      if (result.error) throw result.error;
      return result.data;
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
    } catch (error) {
      const { error: sbError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (sbError) throw sbError;
    }
  },

  async clearAllProducts(): Promise<void> {
    try {
      const response = await fetch('/api/products', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to clear products');
    } catch (error) {
      const { error: sbError } = await supabase
        .from('products')
        .delete()
        .neq('id', 0);
      
      if (sbError) throw sbError;
    }
  },

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch orders from server');
      return await response.json();
    } catch (error) {
      console.warn('Server fetch failed, falling back to direct Supabase call');
      let query = supabase.from('orders').select('*').order('date', { ascending: false });
      
      if (userId) {
        query = query.eq('userId', userId);
      }

      const { data, error: sbError } = await query;
      if (sbError) throw sbError;
      return data || [];
    }
  },

  async createOrder(order: Order): Promise<Order> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      const { data, error: sbError } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
      
      if (sbError) throw sbError;
      return data;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
    } catch (error) {
      const { error: sbError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (sbError) throw sbError;
    }
  },

  async deleteOrder(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete order');
    } catch (error) {
      const { error: sbError } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (sbError) throw sbError;
    }
  },

  // Visitor Stats
  async getVisitorCount(): Promise<number> {
    try {
      const response = await fetch('/api/stats/visitors');
      if (!response.ok) throw new Error('Failed to fetch visitor count');
      const { count } = await response.json();
      return count;
    } catch (error) {
      console.warn('Server fetch failed, falling back to direct Supabase call');
      const { data, error: sbError } = await supabase
        .from('site_stats')
        .select('count')
        .eq('id', 'visitor_count')
        .single();
      
      if (sbError) {
        if (sbError.code === '42P01') {
          console.error("Database Error: 'site_stats' table missing. Run this in Supabase SQL Editor: CREATE TABLE site_stats (id TEXT PRIMARY KEY, count INTEGER DEFAULT 0); INSERT INTO site_stats (id, count) VALUES ('visitor_count', 0);");
          throw sbError; // Throw so AdminPage can catch it
        } else if (sbError.code !== 'PGRST116') {
          throw sbError;
        }
      }
      return data?.count || 0;
    }
  },

  async incrementVisitorCount(): Promise<number> {
    try {
      const response = await fetch('/api/stats/visitors/increment', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to increment visitor count');
      const { count } = await response.json();
      return count;
    } catch (error) {
      console.warn('Server increment failed, falling back to direct Supabase call');
      // Direct call is tricky because of the increment logic, but we can try
      const { data: currentData } = await supabase
        .from('site_stats')
        .select('count')
        .eq('id', 'visitor_count')
        .single();
      
      const newCount = (currentData?.count || 0) + 1;
      const { data, error: sbError } = await supabase
        .from('site_stats')
        .upsert({ id: 'visitor_count', count: newCount })
        .select()
        .single();
      
      if (sbError) {
        if (sbError.code === '42P01') {
          console.error("Database Error: 'site_stats' table missing. Run this in Supabase SQL Editor: CREATE TABLE site_stats (id TEXT PRIMARY KEY, count INTEGER DEFAULT 0); INSERT INTO site_stats (id, count) VALUES ('visitor_count', 0);");
          return newCount;
        }
        throw sbError;
      }
      return data.count;
    }
  },

  // Helper to check if Supabase is configured
  isConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!url && !!key && url !== 'https://your-project-url.supabase.co';
  }
};
