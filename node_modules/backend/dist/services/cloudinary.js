import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const cloudinaryService = {
    async uploadImage(buffer, options = {}) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'ai-product-studio/originals',
                resource_type: 'image',
                ...options,
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            uploadStream.end(buffer);
        });
    },
    async generateVariation(publicId, prompt, options = {}) {
        const transformation = [
            { effect: `gen_fill:prompt_${encodeURIComponent(prompt)}` },
        ];
        if (options.aspectRatio) {
            transformation.push({ aspect_ratio: options.aspectRatio, crop: 'fill' });
        }
        return cloudinary.uploader.upload(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`, {
            folder: 'ai-product-studio/generated',
            public_id: `${publicId}-variation-${options.variationIndex || Date.now()}`,
            transformation,
            resource_type: 'image',
        });
    },
    async generateMultipleVariations(publicId, prompts, aspectRatio) {
        const promises = prompts.map((prompt, index) => this.generateVariation(publicId, prompt, {
            aspectRatio,
            variationIndex: index
        }));
        return Promise.all(promises);
    },
    async transformImage(publicId, transformations) {
        return cloudinary.uploader.upload(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`, {
            folder: 'ai-product-studio/transformed',
            public_id: `${publicId}-transformed-${Date.now()}`,
            transformation: transformations,
            resource_type: 'image',
        });
    },
    async getAssetInfo(publicId) {
        return cloudinary.api.resource(publicId);
    },
    async deleteAsset(publicId) {
        return cloudinary.uploader.destroy(publicId);
    },
    getOptimizedUrl(publicId, transformations = {}) {
        const defaultTransformations = {
            f: 'auto',
            q: 'auto',
            ...transformations,
        };
        return cloudinary.url(publicId, { transformation: [defaultTransformations] });
    },
    getUrl(publicId, transformations = []) {
        return cloudinary.url(publicId, { transformation: transformations });
    },
};
export default cloudinaryService;
//# sourceMappingURL=cloudinary.js.map