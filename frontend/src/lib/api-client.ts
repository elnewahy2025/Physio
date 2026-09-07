import type {
  HealthStatus,
  ApiResponse,
  ApiError,
  PaginationParams,
} from "@physio/contracts";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * API Client for Physio Center Management System
 * Provides typed HTTP requests with error handling
 */

class ApiClient {
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}/api${endpoint}`);
    
    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: {
          code: "UNKNOWN_ERROR",
          message: "Request failed",
        },
      }));
      throw error;
    }

    return response.json() as Promise<T>;
  }

  // GET request
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, params);
  }

  // POST request
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  }

  // PUT request
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, data);
  }

  // PATCH request
  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PATCH", endpoint, data);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }

  // Health check
  async health(): Promise<HealthStatus> {
    return this.get<HealthStatus>("/health");
  }
}

export const apiClient = new ApiClient();
