import { useState } from 'react';
import { Button } from './Button';
import type { UploadedImage } from '@/types';
import { getOptimizedUrl } from '@/services/cloudinary';

interface ImagePreviewProps {
  image: UploadedImage | null;
  onRemove?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function ImagePreview({ image, onRemove, onGenerate, isGenerating }: ImagePreviewProps) {
  const [imgError, setImgError] = useState(false);
  
  if (!image) return null;

  const previewUrl = getOptimizedUrl(image.publicId, { width: 600, height: 600 });

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Product Preview</h2>
        {onRemove && (
          <Button variant="ghost" onClick={onRemove} className="p-2" aria-label="Remove image">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
      
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{image.width} × {image.height}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.251 2.251 0 005.25 21h13.5A2.251 2.251 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span>{(image.bytes / 1024).toFixed(1)} KB</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a.083.083 0 01-.083-.083v-4.583a.083.083 0 01.083-.083h4.583a.083.083 0 01.083.083v4.583a.083.083 0 01-.083.083h-4.583z" />
          </svg>
          <span>{image.format ? image.format.toUpperCase() : 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Ready to generate</span>
        </div>
      </div>
      
      {onGenerate && (
        <div className="mt-6">
          <Button 
            variant="primary" 
            className="w-full" 
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              'Generate Marketing Assets'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}