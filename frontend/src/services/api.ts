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
            body: JSON.stringify({email, password}),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Login failed');
        }

        return await response.json() as TokenResponse;
    }

    // Files
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

    // src/services/api.ts - Add these methods to your existing ApiService class

// Wikipedia endpoints
    async searchWikipedia(query: string, limit: number = 10): Promise<WikipediaSearchResult[]> {
        const response = await fetch(`${API_URL}/wikipedia/search?query=${query}&limit=${limit}`);
        console.log(response);

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

    async uploadWikipediaThread(data: { wikipedia_title: string; description: string }, token: string): Promise<{
        thread_id: string
    }> {
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
}

export const apiService = new ApiService();
export default apiService;