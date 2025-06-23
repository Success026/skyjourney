// hooks/useAdmin.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminStats, Booking, User } from '@/types';

export function useAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    bookings: true,
    users: true,
  });
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      // Fetch total bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, total_amount');

      if (bookingsError) {
        throw bookingsError;
      }

      // Fetch total users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id');

      if (usersError) {
        throw usersError;
      }

      // Calculate total revenue
      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + (booking.total_amount || 0),
        0
      );

      setStats({
        totalBookings: bookings.length,
        totalRevenue,
        activeUsers: users.length, // Assuming all users are active
        flightsThisMonth: 0, // Replace with actual logic if available
        popularRoutes: [], // Replace with actual logic if available
      });

      setLoading((prev) => ({ ...prev, stats: false }));
    } catch (err) {
      setError(err as Error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*');

      if (error) {
        throw error;
      }

      setAllBookings(bookings || []);
      setLoading((prev) => ({ ...prev, bookings: false }));
    } catch (err) {
      setError(err as Error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        throw error;
      }

      setAllUsers(users || []);
      setLoading((prev) => ({ ...prev, users: false }));
    } catch (err) {
      setError(err as Error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) {
        throw error;
      }

      setAllBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAllBookings();
    fetchAllUsers();
  }, []);

  return {
    stats,
    allBookings,
    allUsers,
    loading,
    error,
    updateBookingStatus,
    refetchStats: fetchStats,
    refetchBookings: fetchAllBookings,
    refetchUsers: fetchAllUsers,
  };
}