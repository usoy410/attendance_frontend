import { BASE_API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export interface AttendancePayload {
  firstName: string;
  lastName: string;
  CSY: string;
  studentId: string;
  gbox: string;
  AM?: boolean;
  PM?: boolean;
  
}

const API_URL = `${BASE_API_URL}/attendance`;

const getAuthHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const useAttendance = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        setToken(storedToken);
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadToken();
  }, []);

  // Submit Attendance
  const submitAttendance = async (
    eventId: string,
    payload: AttendancePayload,
  ) => {
    if (!token) {
      Alert.alert(
        "Error",
        "No authentication token found. Please login again.",
      );
      return false;
    }

    setIsLoading(true);
    try {
      const url = `${API_URL}/${eventId}`;
      console.log("Submitting attendance to:", url);
      console.log("Payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Attendance response status:", response.status);
      console.log("Attendance response data:", data);

      if (!response.ok) {
        const errorMessage =
          data.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Attendance submission error:", error);
      Alert.alert("Error", `Failed to submit attendance: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitAttendance, isLoading };
};
