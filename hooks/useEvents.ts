import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { EVENTS_API_URL } from '../constants/api';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
}

const API_URL = EVENTS_API_URL;


export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      Alert.alert('Error', 'Could not load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Add Event
  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to add event');

      const newEvent = await response.json();
      setEvents(prev => [...prev, newEvent]);
      return true; // Success
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add event.');
      return false;
    }
  };

  // Update Event
  const updateEvent = async (id: number, event: Omit<Event, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update event');

      const updatedEvent = await response.json();
      setEvents(prev => prev.map(ev => (ev.id === id ? updatedEvent : ev)));
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update event.');
      return false;
    }
  };

  // Delete Event
  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');

      setEvents(prev => prev.filter(ev => ev.id !== id));
      return true;
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
  };
};
