// Client-side API functions for the frontend
import { Hackathon, HackathonSource } from '../types/hackathon';

const API_BASE_URL = '/api';

export interface HackathonFilters {
  search?: string;
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface HackathonResponse {
  hackathons: Hackathon[];
  total: number;
}

export interface HackathonStats {
  total: number;
  upcoming: number;
  ongoing: number;
  ended: number;
  totalPrize: string;
}

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Hackathon endpoints
  async getHackathons(filters: HackathonFilters = {}): Promise<HackathonResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/hackathons${queryString ? `?${queryString}` : ''}`;
    
    return this.request<HackathonResponse>(endpoint);
  }

  async getHackathon(id: string): Promise<Hackathon> {
    return this.request<Hackathon>(`/hackathons/${id}`);
  }

  async getHackathonStats(): Promise<HackathonStats> {
    return this.request<HackathonStats>('/hackathons/stats');
  }

  // Source endpoints (admin)
  async getSources(): Promise<HackathonSource[]> {
    return this.request<HackathonSource[]>('/sources');
  }

  async createSource(source: Omit<HackathonSource, 'id' | 'lastFetched' | 'hackathonsCount'>): Promise<HackathonSource> {
    return this.request<HackathonSource>('/sources', {
      method: 'POST',
      body: JSON.stringify(source),
    });
  }

  async updateSource(provider: string, updates: Partial<HackathonSource>): Promise<void> {
    return this.request<void>(`/sources/${provider}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSource(provider: string): Promise<void> {
    return this.request<void>(`/sources/${provider}`, {
      method: 'DELETE',
    });
  }

  async fetchFromSource(provider: string): Promise<{ success: boolean; count: number; message: string }> {
    return this.request<{ success: boolean; count: number; message: string }>(`/sources/${provider}/fetch`, {
      method: 'POST',
    });
  }
}

export const apiClient = new APIClient();