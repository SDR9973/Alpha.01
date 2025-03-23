import {
    TokenResponse,
    NetworkAnalysisResponse,
    ApiError,
    ResearchResponse,
    WikipediaSearchResult,
    WikipediaPage
} from '../types/api';
import {AnalysisParams, ResearchFormData} from "../types/state";

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

    async register(name: string, email: string, password: string): Promise<TokenResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({name, email, password}),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Registration failed');
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

    async listFiles(token: string): Promise<string[]> {
        const response = await fetch(`${API_URL}/files`, {
            method: 'GET',
            headers: this.getHeaders(token),
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
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to delete file');
        }
    }

    // Network Analysis
    async analyzeNetwork(
        filename: string,
        params: Partial<AnalysisParams>,
        token: string
    ): Promise<NetworkAnalysisResponse> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
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

    // Research Management
    async getResearches(token: string): Promise<ResearchResponse[]> {
        const response = await fetch(`${API_URL}/research`, {
            method: 'GET',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to fetch researches');
        }

        return await response.json() as ResearchResponse[];
    }

    async getResearchById(id: string, token: string): Promise<ResearchResponse> {
        const response = await fetch(`${API_URL}/research/${id}`, {
            method: 'GET',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to fetch research');
        }

        return await response.json() as ResearchResponse;
    }

    async saveResearch(data: ResearchResponse, token: string): Promise<ResearchResponse> {
        const response = await fetch(`${API_URL}/research`, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to save research');
        }

        return await response.json() as ResearchResponse;
    }

    async updateResearch(id: string, data: ResearchFormData, token: string): Promise<ResearchResponse> {
        const response = await fetch(`${API_URL}/research/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to update research');
        }

        return await response.json() as ResearchResponse;
    }

    async deleteResearch(id: string, token: string): Promise<{ success: boolean }> {
        const response = await fetch(`${API_URL}/research/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(token),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to delete research');
        }

        return await response.json() as { success: boolean };
    }

    // Wikipedia Integration
    async searchWikipedia(query: string): Promise<WikipediaSearchResult[]> {
        const response = await fetch(`${API_URL}/wikipedia/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Wikipedia search failed');
        }

        return await response.json() as WikipediaSearchResult[];
    }

    async getWikipediaPage(title: string): Promise<WikipediaPage> {
        const response = await fetch(`${API_URL}/wikipedia/page/${encodeURIComponent(title)}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to get Wikipedia page');
        }

        return await response.json() as WikipediaPage;
    }

    async getWikipediaTalkPage(title: string): Promise<WikipediaPage> {
        const response = await fetch(`${API_URL}/wikipedia/talk/${encodeURIComponent(title)}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to get Wikipedia talk page');
        }

        return await response.json() as WikipediaPage;
    }

    async uploadWikipediaThread(
        data: { title: string; description: string },
        token: string
    ): Promise<{ thread_id: string }> {
        const response = await fetch(`${API_URL}/wikipedia/upload-threaded`, {
            method: 'POST',
            headers: this.getHeaders(token),
            body: JSON.stringify({
                wikipedia_title: data.title,
                description: data.description
            }),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to upload Wikipedia thread');
        }

        return await response.json() as { thread_id: string };
    }

    // User Profile
    async updateProfile(userId: string, data, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: this.getHeaders(token),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to update profile');
        }

        return await response.json();
    }

    async uploadAvatar(file: File, token: string): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/users/avatar`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json() as ApiError;
            throw new Error(error.detail || 'Failed to upload avatar');
        }

        return await response.json() as { avatarUrl: string };
    }
}

export const apiService = new ApiService();
export default apiService;