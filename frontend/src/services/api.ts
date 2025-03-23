import {
  TokenResponse,
  NetworkAnalysisResponse,
  ApiError
} from '../types/api';

const API_URL = 'http://localhost:8000';

class ApiService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Authentication
  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Login failed');
    }

    return await response.json() as TokenResponse;
  }

  // Files
  async uploadFile(file: File, token: string): Promise<{filename: string}> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'File upload failed');
    }

    return await response.json() as {filename: string};
  }

  // Network Analysis
  async analyzeNetwork(
    filename: string,
    params: Record<string, string | number | boolean>,
    token: string
  ): Promise<NetworkAnalysisResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${API_URL}/analyze/network/${filename}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.getHeaders(token),
      }
    );

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Network analysis failed');
    }

    return await response.json() as NetworkAnalysisResponse;
  }

  // Additional methods for other API endpoints
}

export const apiService = new ApiService();
export default apiService;