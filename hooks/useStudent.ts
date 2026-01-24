import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { BASE_API_URL } from '../constants/api';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  CSY: string;
  studentId: string;
  gbox: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = `${BASE_API_URL}/student`;

const getAuthHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const useStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token (similar to others)

  // Create Student
  const createStudent = useCallback(async (student: Omit<Student, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(student),
      });
      if (!response.ok) throw new Error('Failed to create student');
      const result = await response.json();
      // Assuming success
      setStudents(prev => [...prev, { ...student, _id: result._id || Date.now().toString() }]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      Alert.alert('Error', 'Failed to create student.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Assume other methods if backend had them

  return {
    students,
    loading,
    error,
    createStudent,
  };
};
