import type { UploadedImage, GenerationOptions, GeneratedAsset, GenerationStatus, TransformOptions } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new ApiError(response.status, data.error || data.message || 'Request failed');
  }
  
  return data;
}

export const api = {
  async uploadImage(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse<UploadedImage>(response);
  },

  async generateVariations(publicId: string, options: GenerationOptions): Promise<{ jobId: string }> {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId, ...options }),
    });
    
    return handleResponse<{ jobId: string }>(response);
  },

  async getGenerationStatus(jobId: string): Promise<GenerationStatus> {
    const response = await fetch(`${API_BASE}/generate/${jobId}/status`);
    return handleResponse<GenerationStatus>(response);
  },

  async transformAsset(publicId: string, options: TransformOptions): Promise<GeneratedAsset> {
    const response = await fetch(`${API_BASE}/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId, ...options }),
    });
    
    return handleResponse<GeneratedAsset>(response);
  },

  async getAsset(publicId: string): Promise<GeneratedAsset> {
    const response = await fetch(`${API_BASE}/asset/${publicId}`);
    return handleResponse<GeneratedAsset>(response);
  },

  async deleteAsset(publicId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/asset/${publicId}`, {
      method: 'DELETE',
    });
    await handleResponse<void>(response);
  },
};

export { ApiError };