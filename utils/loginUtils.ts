import { BASE_API_URL } from "@/constants/api";

const API_URL = `${BASE_API_URL}/auth/login`;
export const REQUEST_TIMEOUT_MS = 30000;

export const getErrorMessage = (status: number, data: any): string => {
  if (status === 401) return "Invalid student ID or password.";
  if (status === 500) return "Server error. Please try again later.";
  if (status === 400) return data.message || "Invalid request. Please check your input.";
  return data.message || `Login failed with status ${status}`;
};

export const performLogin = async (studentId: string, password: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(getErrorMessage(response.status, data));
    }

    if (!data.token) {
      throw new Error("Token missing from response");
    }

    return data.token;
  } finally {
    clearTimeout(timeoutId);
  }
};
