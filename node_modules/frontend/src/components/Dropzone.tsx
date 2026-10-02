import { useCallback, useState, DragEvent } from 'react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  isLoading?: boolean;
  error?: string | null;
}

export function Dropzone({ 
  onFileSelect, 
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 10 * 1024 * 1024, // 10MB
  isLoading = false,
  error 
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragCount, setDragCount] = useState(0);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Unsupported file type. Please upload: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`;
    }
    return null;
  }, [acceptedTypes, maxSize]);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCount(0);
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        handleFile(file);
      } catch (err) {
        // Error handled by parent
      }
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCount(prev => prev + 1);
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCount(prev => prev - 1);
    if (dragCount === 1) {
      setIsDragActive(false);
    }
  }, [dragCount]);

  const handleClick = useCallback(() => {
    if (isLoading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes.join(',');
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        try {
          handleFile(file);
        } catch (err) {
          // Error handled by parent
        }
      }
    };
    input.click();
  }, [isLoading, acceptedTypes, handleFile]);

  return (
    <div
      className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <input type="file" hidden accept={acceptedTypes.join(',')} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          try {
            handleFile(file);
          } catch (err) {
            // Error handled by parent
          }
        }
      }} />
      
      <div className="space-y-4">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <div>
          <p className="text-lg font-medium text-gray-900">Drop your product image here</p>
          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        </div>
        
        <p className="text-xs text-gray-400">
          Supports: JPG, PNG, WebP • Max 10MB
        </p>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}