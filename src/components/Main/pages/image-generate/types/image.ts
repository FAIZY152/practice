export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface GeneratorFormData {
  prompt: string;
  numberOfPhotos: string;
  dimensions: string;
}

export interface ImageGenerationFormData {
  prompt: string;
}

export type ImageSize = "256x256" | "512x512" | "1024x1024";
export type PhotoCount = "1" | "2" | "4" | "8";
