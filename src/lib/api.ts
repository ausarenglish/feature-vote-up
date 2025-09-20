export interface Feature {
  id: string;
  title: string;
  votes: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new APIError(`Request failed: ${response.statusText}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error occurred');
  }
}

export async function getFeatures(): Promise<Feature[]> {
  return apiRequest<Feature[]>('/features');
}

export async function createFeature(title: string): Promise<Feature> {
  return apiRequest<Feature>('/features', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function upvoteFeature(id: string): Promise<Feature> {
  return apiRequest<Feature>(`/features/${id}/upvote`, {
    method: 'POST',
  });
}