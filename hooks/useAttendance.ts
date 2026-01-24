import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ATTENDANCE_API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Attendance {
  _id: string;
  student: string; 
  event: string;
  AM?: boolean;
  PM?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = ATTENDANCE_API_URL;

const getAuthHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const useAttendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token
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

  // Mark Attendance
  const markAttendance = useCallback(async (eventId: string, studentId: string, session: 'AM' | 'PM', present: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        studentId,
        eventId,
        [session]: present,
      };
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to mark attendance');
      const result = await response.json();
      // Assuming success, update local state
      setAttendances(prev => {
        const existing = prev.find(a => a.event === eventId && a.student === studentId);
        if (existing) {
          return prev.map(a => a._id === existing._id ? { ...a, [session]: present } : a);
        } else {
          // Add new
          return [...prev, { _id: result._id || Date.now().toString(), student: studentId, event: eventId, [session]: present }];
        }
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      Alert.alert('Error', 'Failed to mark attendance.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get Attendances for Event
  const getAttendancesForEvent = useCallback(async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming backend has GET /attendance?eventId=...
      const response = await fetch(`${API_URL}?eventId=${eventId}`, {
        headers: getAuthHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch attendances');
      const data = await response.json();
      setAttendances(data.attendances || []);
      return data.attendances || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      Alert.alert('Error', 'Could not load attendances.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    attendances,
    loading,
    error,
    markAttendance,
    getAttendancesForEvent,
  };
};
