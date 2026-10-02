export interface UploadedImage {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface GenerationOptions {
  scene: string;
  purpose: string;
  style: string;
  variations: number;
}

export interface GeneratedAsset {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  originalUrl: string;
  prompt: string;
  scene: string;
  purpose: string;
  style: string;
  variation: number;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

export interface TransformOptions {
  aspectRatio: string;
  format?: string;
  quality?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  error?: string;
  assets?: GeneratedAsset[];
}