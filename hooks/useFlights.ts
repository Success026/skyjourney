// hooks/useFlights.ts
import { useState } from 'react';
import { searchFlights } from '@/lib/amadeus';

export function useFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (params: Record<string, string>) => {
    setLoading(true);
    try {
      const data = await searchFlights(params);
      setFlights(data.data);
      return data.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { flights, loading, error, search };
}