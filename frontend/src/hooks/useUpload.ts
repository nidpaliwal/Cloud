import { useState, useCallback } from 'react';
import { ApiError } from '@/services/api';
import type { UploadedImage } from '@/types';

export function useUpload() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      const xhr = new XMLHttpRequest();
      
      const result = await new Promise<UploadedImage>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.data || data);
            } catch {
              reject(new Error('Invalid response'));
            }
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new ApiError(xhr.status, data.error || data.message || 'Upload failed'));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });
        
        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
        
        const formData = new FormData();
        formData.append('image', file);
        
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        xhr.open('POST', `${apiUrl}/upload`);
        xhr.send(formData);
      });
      
      setUploadedImage(result);
      setUploadProgress(100);
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setUploadedImage(null);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadedImage,
    isUploading,
    uploadProgress,
    error,
    upload,
    clear,
  };
}