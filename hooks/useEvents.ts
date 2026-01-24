import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { EVENTS_API_URL } from '../constants/api';
export interface Event {
  _id: string;
  eventTitle: string;
  eventDescription: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = EVENTS_API_URL;

const getAuthHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Load token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        setToken(storedToken);
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

  // Fetch Events
  const fetchEvents = useCallback(async (currentPage: number = page, currentLimit: number = limit) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_URL}?page=${currentPage}&limit=${currentLimit}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
          setTotal(data.total || 0);
          setPage(currentPage);
          setLimit(currentLimit);
          setLoading(false);
          return;
        } else {
          throw new Error('Invalid response format');
        }
      } else if (response.status === 404) {
        // No events found, treat as empty
        setEvents([]);
        setTotal(0);
        setPage(currentPage);
        setLimit(currentLimit);
        setLoading(false);
        return;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      Alert.alert('Error', 'Could not load events.');
      setLoading(false);
    }
  }, [page, limit, token]);

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchEvents(page, limit);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchEvents, loading, page, limit]);

  // Add Event
  const addEvent = async (event: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to add event');

      const result = await response.json();
      if (result.message === 'succesfully created') {
        await fetchEvents(); // Refetch to get the new event
        return true;
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add event.');
      return false;
    }
  };

  // Update Event
  const updateEvent = async (id: string, event: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update event');

      const result = await response.json();
      if (result.success && result.updatedEvent) {
        setEvents(prev => prev.map(ev => (ev._id === id ? result.updatedEvent : ev)));
        return true;
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update event.');
      return false;
    }
  };

  // Delete Event
  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to delete event');

      const result = await response.json();
      if (result.success) {
        setEvents(prev => prev.filter(ev => ev._id !== id));
        return true;
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete event.');
      return false;
    }
  };

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    page,
    limit,
    total,
    setPage: (newPage: number) => fetchEvents(newPage, limit),
    setLimit: (newLimit: number) => fetchEvents(1, newLimit),
  };
};
