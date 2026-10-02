const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export function getCloudinaryUrl(publicId: string, transformations: Record<string, string> = {}): string {
  if (!CLOUD_NAME) {
    console.warn('Cloudinary cloud name not configured');
    return '';
  }
  
  const params = new URLSearchParams();
  Object.entries(transformations).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  const transformString = params.toString() ? `/${params.toString()}` : '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${transformString}/${publicId}`;
}

export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  aspectRatio?: string;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best' | number;
} = {}): string {
  const transformations: Record<string, string> = {
    f: options.format || 'auto',
    q: String(options.quality || 'auto'),
  };
  
  if (options.width) transformations.w = String(options.width);
  if (options.height) transformations.h = String(options.height);
  if (options.aspectRatio) transformations.ar = options.aspectRatio;
  if (options.width || options.height) transformations.c = 'fill';
  
  return getCloudinaryUrl(publicId, transformations);
}

export const ASPECT_RATIOS = {
  square: '1:1',
  instagram: '1:1',
  story: '9:16',
  banner: '16:9',
  feed: '4:5',
  landscape: '3:2',
  portrait: '2:3',
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;