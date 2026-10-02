import type { UploadApiResponse, UploadApiOptions } from 'cloudinary';
export declare const cloudinaryService: {
    uploadImage(buffer: Buffer, options?: UploadApiOptions): Promise<UploadApiResponse>;
    generateVariation(publicId: string, prompt: string, options?: {
        aspectRatio?: string;
        variationIndex?: number;
    }): Promise<UploadApiResponse>;
    generateMultipleVariations(publicId: string, prompts: string[], aspectRatio?: string): Promise<UploadApiResponse[]>;
    transformImage(publicId: string, transformations: Record<string, any>[]): Promise<UploadApiResponse>;
    getAssetInfo(publicId: string): Promise<any>;
    deleteAsset(publicId: string): Promise<any>;
    getOptimizedUrl(publicId: string, transformations?: Record<string, any>): string;
    getUrl(publicId: string, transformations?: Record<string, any>[]): string;
};
export default cloudinaryService;
//# sourceMappingURL=cloudinary.d.ts.map