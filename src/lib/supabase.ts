import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper functions for common operations
export const supabaseHelpers = {
  // Auth helpers
  async signUp(email: string, password: string, userData?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Events helpers
  async getEvents(filters?: { category?: string; status?: string; limit?: number }) {
    let query = supabase
      .from('events')
      .select(`
        *,
        venues (
          id,
          name,
          address,
          city,
          capacity,
          amenities
        )
      `)
      .eq('status', 'active')
      .order('date', { ascending: true });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venues (
          id,
          name,
          address,
          city,
          capacity,
          amenities,
          latitude,
          longitude
        ),
        sections (
          id,
          name,
          type,
          price,
          capacity,
          description,
          color,
          position_data,
          seats (
            id,
            row_name,
            seat_number,
            status,
            position_x,
            position_y
          )
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Orders helpers
  async createOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    return { data, error };
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        events (
          id,
          title,
          date,
          time,
          venue_name,
          venue_address,
          image_url
        ),
        tickets (
          id,
          ticket_number,
          status,
          qr_code,
          price,
          sections (
            name
          ),
          seats (
            row_name,
            seat_number
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Real-time subscriptions
  subscribeToEvents(callback: (payload: any) => void) {
    return supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        callback
      )
      .subscribe();
  },

  subscribeToSeats(eventId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`seats-${eventId}`)
      .on('postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'seats',
          filter: `section_id=in.(select id from sections where event_id=eq.${eventId})`
        },
        callback
      )
      .subscribe();
  }
};