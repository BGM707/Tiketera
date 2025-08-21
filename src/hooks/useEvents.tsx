import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../lib/supabase';
import { useNotifications } from './useNotifications';
import { Event } from '../types';

export function useEvents(filters?: { category?: string; status?: string; limit?: number }) {
  const { addNotification } = useNotifications();

  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.getEvents(filters);
      if (error) {
        addNotification({
          type: 'error',
          title: 'Error al cargar eventos',
          message: error.message,
          duration: 5000
        });
        throw error;
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEvent(id: string) {
  const { addNotification } = useNotifications();

  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.getEvent(id);
      if (error) {
        addNotification({
          type: 'error',
          title: 'Error al cargar evento',
          message: error.message,
          duration: 5000
        });
        throw error;
      }
      return data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useRealtimeEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabaseHelpers.subscribeToEvents((payload) => {
      console.log('Event change:', payload);
      
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      // Update local state if needed
      if (payload.eventType === 'INSERT') {
        setEvents(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setEvents(prev => prev.map(event => 
          event.id === payload.new.id ? payload.new : event
        ));
      } else if (payload.eventType === 'DELETE') {
        setEvents(prev => prev.filter(event => event.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return events;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data, error } = await supabaseHelpers.createOrder(orderData);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      addNotification({
        type: 'success',
        title: 'Orden creada',
        message: `Orden ${data.order_number} creada exitosamente`,
        duration: 5000
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Error al crear orden',
        message: error.message,
        duration: 5000
      });
    }
  });
}

export function useUserOrders(userId?: string) {
  const { addNotification } = useNotifications();

  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabaseHelpers.getUserOrders(userId);
      if (error) {
        addNotification({
          type: 'error',
          title: 'Error al cargar órdenes',
          message: error.message,
          duration: 5000
        });
        throw error;
      }
      return data;
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}