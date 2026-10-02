import { useState } from 'react';
import { Button } from './Button';
import type { GeneratedAsset } from '@/types';
import { getOptimizedUrl, ASPECT_RATIOS } from '@/services/cloudinary';

interface AssetGalleryProps {
  assets: GeneratedAsset[];
  originalImage?: { publicId: string; url: string } | null;
  onDownload: (asset: GeneratedAsset) => void;
  onShare: (asset: GeneratedAsset) => void;
  onCompare: (asset: GeneratedAsset) => void;
  onTransform?: (asset: GeneratedAsset, aspectRatio: string) => void;
}

const ASPECT_RATIO_OPTIONS = Object.entries(ASPECT_RATIOS).map(([key, value]) => ({
  key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
  value,
}));

export function AssetGallery({ assets, originalImage, onDownload, onShare, onCompare, onTransform }: AssetGalleryProps) {
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const handleCompare = (asset: GeneratedAsset) => {
    setSelectedAsset(asset);
    setShowCompare(true);
    onCompare(asset);
  };

  if (assets.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-4 text-gray-500">No assets generated yet</p>
      </div>
    );
  }

  const handleDownload = (asset: GeneratedAsset) => {
    const link = document.createElement('a');
    link.href = asset.secureUrl;
    link.download = `${asset.publicId}.${asset.format}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload(asset);
  };

  const handleShare = (asset: GeneratedAsset) => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Generated Product Image',
        text: `Check out this AI-generated product variation`,
        url: asset.secureUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(asset.secureUrl);
      alert('Link copied to clipboard!');
    }
    onShare(asset);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Generated Assets ({assets.length})</h2>
        {originalImage && (
          <Button variant="secondary" onClick={() => setShowCompare(true)}>
            Compare with Original
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset, index) => (
          <AssetCard
            key={asset.id || asset.publicId}
            asset={asset}
            index={index + 1}
            onDownload={handleDownload}
            onShare={handleShare}
            onCompare={handleCompare}
            onTransform={onTransform ? (ratio) => onTransform(asset, ratio) : undefined}
          />
        ))}
      </div>

      {showCompare && selectedAsset && originalImage && (
        <ComparisonModal
          original={originalImage}
          generated={selectedAsset}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}

function AssetCard({ asset, index, onDownload, onShare, onCompare, onTransform }: {
  asset: GeneratedAsset;
  index: number;
  onDownload: (asset: GeneratedAsset) => void;
  onShare: (asset: GeneratedAsset) => void;
  onCompare: (asset: GeneratedAsset) => void;
  onTransform?: (ratio: string) => void;
}) {
  const [showTransform, setShowTransform] = useState(false);
  const previewUrl = getOptimizedUrl(asset.publicId, { width: 400, height: 400 });

  return (
    <div className="card overflow-hidden relative group">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={previewUrl}
          alt={`Variation ${index}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
            #{index}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" className="p-2 bg-white/90" onClick={() => onCompare(asset)} aria-label="Compare">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Variation {index}</span>
          <span className="text-gray-400">{asset.format.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-0.5 bg-gray-100 rounded">{asset.scene}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded">{asset.purpose}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded">{asset.style}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex-1 text-sm py-2" onClick={() => onDownload(asset)}>
            Download
          </Button>
          <Button variant="ghost" className="p-2" onClick={() => onShare(asset)} aria-label="Share">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </Button>
        </div>

        {onTransform && (
          <Button 
            variant="ghost" 
            className="w-full text-sm justify-center"
            onClick={() => setShowTransform(true)}
          >
            Create Format Variants
          </Button>
        )}

        {showTransform && (
          <div className="flex flex-wrap gap-1">
            {ASPECT_RATIO_OPTIONS.map(({ key, label, value }) => (
              <button
                key={key}
                className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                onClick={() => {
                  onTransform?.(value);
                  setShowTransform(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonModal({ original, generated, onClose }: {
  original: { publicId: string; url: string };
  generated: GeneratedAsset;
  onClose: () => void;
}) {
  const originalUrl = generated.originalUrl || original.url;
  const generatedUrl = getOptimizedUrl(generated.publicId, { width: 600 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Compare: Original vs Generated</h3>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Original</p>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={originalUrl} alt="Original" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Generated (Variation)</p>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={generatedUrl} alt="Generated" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 mb-4">
            Scene: {generated.scene} • Purpose: {generated.purpose} • Style: {generated.style}
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={onClose}>Use This</Button>
            <Button variant="secondary" onClick={onClose}>Back to Gallery</Button>
          </div>
        </div>
      </div>
    </div>
  );
}