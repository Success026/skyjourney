// hooks/useBooking.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Booking, CreateBookingInput, UpdateBookingInput } from '@/types';

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = async (bookingData: CreateBookingInput): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBookings((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const fetchUserBookings = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', userId);

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'canceled' })
        .eq('id', bookingId);

      if (error) {
        throw error;
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'canceled' } : b))
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    cancelBooking,
  };
}