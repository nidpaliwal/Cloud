import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import type { GenerationOptions, GenerationStatus, GeneratedAsset } from '@/types';

export function useGeneration() {
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const jobIdRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback((jobId: string) => {
    jobIdRef.current = jobId;
    
    const poll = async () => {
      try {
        const result = await api.getGenerationStatus(jobId);
        setStatus(result);
        
        if (result.status === 'completed' && result.assets) {
          setAssets(result.assets);
          stopPolling();
          setIsGenerating(false);
        } else if (result.status === 'failed') {
          setError(result.message || 'Generation failed');
          stopPolling();
          setIsGenerating(false);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to check status';
        setError(message);
        stopPolling();
        setIsGenerating(false);
      }
    };
    
    poll();
    pollingRef.current = window.setInterval(poll, 2000);
  }, [stopPolling]);

  const generate = useCallback(async (publicId: string, options: GenerationOptions) => {
    setIsGenerating(true);
    setError(null);
    setAssets([]);
    setStatus({ status: 'pending', progress: 0 });
    
    try {
      const { jobId } = await api.generateVariations(publicId, options);
      startPolling(jobId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start generation';
      setError(message);
      setIsGenerating(false);
      throw err;
    }
  }, [startPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setStatus(null);
    setAssets([]);
    setIsGenerating(false);
    setError(null);
    jobIdRef.current = null;
  }, [stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    status,
    assets,
    isGenerating,
    error,
    generate,
    reset,
  };
}