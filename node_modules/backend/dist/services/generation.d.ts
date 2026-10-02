interface GenerationPromptOptions {
    scene: string;
    purpose: string;
    style: string;
    productDescription?: string;
}
export declare function buildPrompt(options: GenerationPromptOptions): string;
export declare function buildVariationPrompts(options: GenerationPromptOptions, count: number): string[];
export declare function generateAssets(publicId: string, options: GenerationPromptOptions, count?: number): Promise<any[]>;
export declare function createFormatVariants(publicId: string, aspectRatio: string): Promise<any>;
export {};
//# sourceMappingURL=generation.d.ts.map