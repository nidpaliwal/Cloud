import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse, UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  async uploadImage(buffer: Buffer, options: UploadApiOptions = {}): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ai-product-studio/originals',
          resource_type: 'image',
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        }
      );
      uploadStream.end(buffer);
    });
  },

  async generateVariation(
    publicId: string,
    prompt: string,
    options: {
      aspectRatio?: string;
      variationIndex?: number;
    } = {}
  ): Promise<UploadApiResponse> {
    const transformation: Record<string, any>[] = [
      { effect: `gen_fill:prompt_${encodeURIComponent(prompt)}` },
    ];
    
    if (options.aspectRatio) {
      transformation.push({ aspect_ratio: options.aspectRatio, crop: 'fill' });
    }

    return cloudinary.uploader.upload(
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`,
      {
        folder: 'ai-product-studio/generated',
        public_id: `${publicId}-variation-${options.variationIndex || Date.now()}`,
        transformation,
        resource_type: 'image',
      }
    );
  },

  async generateMultipleVariations(
    publicId: string,
    prompts: string[],
    aspectRatio?: string
  ): Promise<UploadApiResponse[]> {
    const promises = prompts.map((prompt, index) =>
      this.generateVariation(publicId, prompt, { 
        aspectRatio, 
        variationIndex: index 
      })
    );
    return Promise.all(promises);
  },

  async transformImage(
    publicId: string,
    transformations: Record<string, any>[]
  ): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`,
      {
        folder: 'ai-product-studio/transformed',
        public_id: `${publicId}-transformed-${Date.now()}`,
        transformation: transformations,
        resource_type: 'image',
      }
    );
  },

  async getAssetInfo(publicId: string) {
    return cloudinary.api.resource(publicId);
  },

  async deleteAsset(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  },

  getOptimizedUrl(publicId: string, transformations: Record<string, any> = {}): string {
    const defaultTransformations = {
      f: 'auto',
      q: 'auto',
      ...transformations,
    };
    return cloudinary.url(publicId, { transformation: [defaultTransformations] });
  },

  getUrl(publicId: string, transformations: Record<string, any>[] = []): string {
    return cloudinary.url(publicId, { transformation: transformations });
  },
};

export default cloudinaryService;