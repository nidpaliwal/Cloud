import { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { ImagePreview } from '@/components/ImagePreview';
import { GenerationOptions } from '@/components/GenerationOptions';
import { AssetGallery } from '@/components/AssetGallery';
import { useUpload } from '@/hooks/useUpload';
import { useGeneration } from '@/hooks/useGeneration';
import { LoadingSpinner, ProgressBar } from '@/components/LoadingSpinner';
import type { GenerationOptions as GenerationOptionsType } from '@/types';

export function Home() {
  const { uploadedImage, isUploading, uploadProgress, error: uploadError, upload, clear } = useUpload();
  const { status, assets, isGenerating, error: genError, generate, reset } = useGeneration();
  
  const [activeStep, setActiveStep] = useState<'upload' | 'generate' | 'results'>('upload');

  const handleFileSelect = async (file: File) => {
    try {
      await upload(file);
      setActiveStep('generate');
    } catch (err) {
      // Error handled by upload hook
    }
  };

  const handleGenerate = async (options: GenerationOptionsType) => {
    if (!uploadedImage) return;
    try {
      await generate(uploadedImage.publicId, options);
      setActiveStep('results');
    } catch (err) {
      // Error handled by generation hook
    }
  };

  const handleNewImage = () => {
    clear();
    reset();
    setActiveStep('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">AI Product Studio</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeStep === 'upload' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                1. Upload
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeStep === 'generate' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                2. Generate
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${activeStep === 'results' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                3. Results
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeStep === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Upload Product Image</h2>
              <p className="mt-2 text-gray-600">
                Drop a product photo to get started. We'll transform it into professional marketing assets.
              </p>
            </div>
            
            <Dropzone
              onFileSelect={handleFileSelect}
              isLoading={isUploading}
              error={uploadError}
            />
            
            {isUploading && (
              <div className="mt-6">
                <ProgressBar progress={uploadProgress} label="Uploading to Cloudinary..." />
              </div>
            )}
          </div>
        )}

        {activeStep === 'generate' && uploadedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ImagePreview
                image={uploadedImage}
                onRemove={handleNewImage}
                onGenerate={() => setActiveStep('generate')}
                isGenerating={isGenerating}
              />
            </div>
            <div>
              <GenerationOptions
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              
              {isGenerating && status && (
                <div className="mt-6 card p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Generating Variations...</h3>
                  <ProgressBar progress={status.progress} label={status.message || 'Processing...'} />
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <LoadingSpinner size="sm" />
                    <span>This may take 30-60 seconds</span>
                  </div>
                </div>
              )}
              
              {genError && (
                <div className="mt-6 card p-4 bg-red-50 border-red-200">
                  <p className="text-red-700">{genError}</p>
                  <button
                    className="mt-3 btn-secondary"
                    onClick={() => setActiveStep('generate')}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeStep === 'results' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Generated Assets</h2>
                {isGenerating && status ? (
                  <p className="text-gray-600 mt-1">Generating your variations...</p>
                ) : (
                  <p className="text-gray-600 mt-1">{assets.length} variations ready</p>
                )}
              </div>
              <button 
                className="btn-secondary" 
                onClick={handleNewImage}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Image
              </button>
            </div>
            
            {isGenerating && status ? (
              <div className="card p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Generating Variations...</h3>
                <ProgressBar progress={status.progress} label={status.message || 'Processing...'} />
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <LoadingSpinner size="sm" />
                  <span>This may take 30-60 seconds</span>
                </div>
              </div>
            ) : assets.length > 0 ? (
              <AssetGallery
                assets={assets}
                originalImage={uploadedImage ? { publicId: uploadedImage.publicId, url: uploadedImage.url } : null}
                onDownload={() => {}}
                onShare={() => {}}
                onCompare={() => {}}
              />
            ) : genError ? (
              <div className="card p-4 bg-red-50 border-red-200">
                <p className="text-red-700">{genError}</p>
                <button className="mt-3 btn-secondary" onClick={() => setActiveStep('generate')}>
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No assets generated. Go back and try again.</p>
                <button className="btn-secondary mt-4" onClick={() => setActiveStep('generate')}>
                  Back to Generate
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Powered by Cloudinary AI • Built for Cloudinary AI Hackathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}