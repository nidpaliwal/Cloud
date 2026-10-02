import { cloudinaryService } from './cloudinary.js';

interface GenerationPromptOptions {
  scene: string;
  purpose: string;
  style: string;
  productDescription?: string;
}

const SCENE_PROMPTS: Record<string, string> = {
  outdoor: 'natural outdoor environment with trees, grass, sunlight',
  studio: 'clean professional studio with soft lighting, white background',
  lifestyle: 'realistic lifestyle setting, person using product naturally',
  minimal: 'minimalist clean white background, studio lighting',
  urban: 'modern urban cityscape, street background',
  beach: 'tropical beach with sand, ocean, palm trees',
  mountain: 'mountain landscape, adventure setting, natural light',
  home: 'cozy home interior, warm lighting, lifestyle setting',
};

const PURPOSE_PROMPTS: Record<string, string> = {
  ecommerce: 'professional product photography for e-commerce, clean, detailed',
  social: 'eye-catching social media post, engaging, vibrant',
  ad: 'high-converting advertisement, persuasive, professional',
  story: 'vertical format for Instagram Stories/Reels, immersive',
  banner: 'wide banner format for website header, cinematic',
  email: 'email marketing hero image, clean, compelling',
  print: 'high-resolution print catalog quality, detailed',
};

const STYLE_PROMPTS: Record<string, string> = {
  professional: 'professional, polished, corporate quality',
  vibrant: 'vibrant colors, energetic, saturated',
  moody: 'moody lighting, dramatic shadows, atmospheric',
  clean: 'clean, minimal, uncluttered, sharp',
  warm: 'warm tones, inviting, golden hour lighting',
  cool: 'cool tones, modern, crisp, blue tint',
  vintage: 'vintage film look, retro aesthetic, grain',
  luxury: 'luxury premium feel, elegant, sophisticated',
};

export function buildPrompt(options: GenerationPromptOptions): string {
  const scene = SCENE_PROMPTS[options.scene] || options.scene;
  const purpose = PURPOSE_PROMPTS[options.purpose] || options.purpose;
  const style = STYLE_PROMPTS[options.style] || options.style;
  
  const productPart = options.productDescription 
    ? `featuring ${options.productDescription}` 
    : 'product as main subject';
  
  return `${productPart} in ${scene}, ${purpose} style, ${style}, high quality, 8k resolution, professional lighting`;
}

export function buildVariationPrompts(options: GenerationPromptOptions, count: number): string[] {
  const basePrompt = buildPrompt(options);
  
  const variations = [
    '', // Original prompt
    ' from different angle',
    ' with different lighting',
    ' with subtle background elements',
    ' zoomed out for context',
    ' close-up detail view',
    ' with complementary props',
    ' alternative composition',
  ];
  
  return Array.from({ length: count }, (_, i) => 
    basePrompt + (variations[i] || ` variation ${i + 1}`)
  );
}

export async function generateAssets(
  publicId: string,
  options: GenerationPromptOptions,
  count: number = 4
): Promise<any[]> {
  const prompts = buildVariationPrompts(options, count);
  
  try {
    const results = await cloudinaryService.generateMultipleVariations(publicId, prompts);
    return results.map((result, index) => ({
      publicId: result.public_id,
      url: result.secure_url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      prompt: prompts[index],
      scene: options.scene,
      purpose: options.purpose,
      style: options.style,
      variation: index + 1,
      createdAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Generation error:', error);
    throw new Error('Failed to generate variations');
  }
}

export async function createFormatVariants(
  publicId: string,
  aspectRatio: string
): Promise<any> {
  try {
    const result = await cloudinaryService.transformImage(publicId, [
      { aspect_ratio: aspectRatio, crop: 'fill' },
      { quality: 'auto', fetch_format: 'auto' },
    ]);
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Transform error:', error);
    throw new Error('Failed to create format variant');
  }
}