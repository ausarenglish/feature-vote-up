const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Feature {
  id: number;
  title: string;
  votes: number;
  created_at: string;
}

export async function getFeatures(): Promise<Feature[]> {
  const response = await fetch(`${base}/features`);
  if (!response.ok) {
    throw new Error('Failed to fetch features');
  }
  return response.json();
}

export async function createFeature(title: string): Promise<Feature> {
  const response = await fetch(`${base}/features`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Failed to create feature');
  }
  return response.json();
}

export async function upvoteFeature(id: number): Promise<Feature> {
  const response = await fetch(`${base}/features/${id}/upvote`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to upvote feature');
  }
  return response.json();
}