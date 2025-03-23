import {
  TokenResponse,
  NetworkAnalysisResponse,
  ApiError,
  WikipediaSearchResult,
  WikipediaPage,
  WikipediaThread,
  WikipediaThreadMessage
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

  // Authentication methods
  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({email, password}),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Login failed');
    }

    return await response.json() as TokenResponse;
  }

  // Files methods
  async uploadFile(file: File, token: string): Promise<{ filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${token}`},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'File upload failed');
    }

    return await response.json() as { filename: string };
  }

  async listFiles(token: string): Promise<string[]> {
    const response = await fetch(`${API_URL}/files`, {
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to list files');
    }

    return await response.json();
  }

  async deleteFile(filename: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/files/${filename}`, {
      method: 'DELETE',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to delete file');
    }
  }

  // Network Analysis methods
  async analyzeNetwork(
    filename: string,
    params: Record<string, any>,
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

  // Wikipedia methods
  async searchWikipedia(query: string, limit: number = 10): Promise<WikipediaSearchResult[]> {
    const response = await fetch(`${API_URL}/wikipedia/search?query=${encodeURIComponent(query)}&limit=${limit}`);

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Wikipedia search failed');
    }

    return await response.json();
  }

  async getWikipediaPage(title: string): Promise<WikipediaPage> {
    const response = await fetch(`${API_URL}/wikipedia/page/${encodeURIComponent(title)}`);

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to fetch Wikipedia page');
    }

    return await response.json();
  }

  async getWikipediaTalkPage(title: string): Promise<WikipediaPage> {
    const response = await fetch(`${API_URL}/wikipedia/talk/${encodeURIComponent(title)}`);

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to fetch Wikipedia talk page');
    }

    return await response.json();
  }

  async uploadWikipediaThread(
    data: { wikipedia_title: string; description: string; research_id?: string },
    token: string
  ): Promise<{ thread_id: string }> {
    const response = await fetch(`${API_URL}/wikipedia/upload-threaded`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to upload Wikipedia thread');
    }

    return await response.json();
  }

  async getWikipediaThreadById(threadId: string, token: string): Promise<WikipediaThread> {
    const response = await fetch(`${API_URL}/wikipedia/thread/${threadId}`, {
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to get Wikipedia thread');
    }

    return await response.json();
  }

  async getWikipediaThreadMessages(threadId: string, token: string): Promise<WikipediaThreadMessage[]> {
    const response = await fetch(`${API_URL}/wikipedia/thread/${threadId}/messages`, {
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to get Wikipedia thread messages');
    }

    return await response.json();
  }

  async listWikipediaThreads(researchId: string | undefined, token: string): Promise<WikipediaThread[]> {
    const url = researchId
      ? `${API_URL}/wikipedia/threads?research_id=${researchId}`
      : `${API_URL}/wikipedia/threads`;

    const response = await fetch(url, {
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to list Wikipedia threads');
    }

    return await response.json();
  }

  async analyzeWikipediaThread(
    threadId: string,
    params: Record<string, any>,
    token: string
  ): Promise<NetworkAnalysisResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${API_URL}/wikipedia/network/${threadId}?${queryParams.toString()}`,
      {
        headers: this.getHeaders(token)
      }
    );

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Wikipedia network analysis failed');
    }

    return await response.json() as NetworkAnalysisResponse;
  }

  async deleteWikipediaThread(threadId: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/wikipedia/thread/${threadId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.detail || 'Failed to delete Wikipedia thread');
    }
  }

  // Research methods can be added here
}

export const apiService = new ApiService();
export default apiService;