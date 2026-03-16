/**
 * GlowGuide — shared TypeScript interfaces
 * AI-powered skincare advisor
 */

// ——— Skin profile & concerns ———

export type SkinConcern =
  | "acne"
  | "dryness"
  | "oiliness"
  | "hyperpigmentation"
  | "aging"
  | "sensitivity"
  | "redness"
  | "dullness"
  | "darkCircles"
  | "pores";

export type SkinType =
  | "oily"
  | "dry"
  | "combination"
  | "normal"
  | "sensitive";

export interface SkinProfile {
  concerns: SkinConcern[];
  skinType: SkinType;
  goals: string[];
  photoBase64?: string;
}

// ——— Product (products.json) ———

export type ProductOrigin = "US" | "Korean" | "Chinese" | "Japanese" | "European";

export type ProductCategory =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "sunscreen"
  | "exfoliant"
  | "eyecream"
  | "mask"
  | "treatment";

export interface Product {
  id: string;
  name: string;
  brand: string;
  origin: ProductOrigin;
  category: ProductCategory;
  keyIngredients: string[];
  targets: SkinConcern[];
  price: number;
  currency: string;
  skinTypes: SkinType[];
  rating: number;
  imageUrl?: string;
  purchaseUrl?: string;
  description: string;
}

export interface ProductDatabase {
  products: Product[];
  version?: number;
}

// ——— Routine & AI result ———

export interface RoutineStep {
  order: number;
  product: Product;
  usage: string;
  frequency: string;
  tip: string;
}

export interface SkincareRoutine {
  morning: RoutineStep[];
  evening: RoutineStep[];
}

export interface AIAnalysisResult {
  skinAssessment: string;
  routine: SkincareRoutine;
  warnings: string[];
  generalAdvice: string;
}

// ——— API & UI (scaffold compatibility) ———

export interface AnalyzeRequest {
  imageBase64?: string;
  imageMimeType?: string;
  skinType?: SkinType;
  concerns?: SkinConcern[];
}

export interface AnalyzeResponse {
  success: boolean;
  summary?: string;
  suggestedSkinType?: SkinType;
  suggestedConcerns?: SkinConcern[];
  notes?: string;
  error?: string;
}

export interface ProductsQueryParams {
  concerns?: SkinConcern[];
  skinTypes?: SkinType[];
  categories?: ProductCategory[];
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
}

export interface QuizFormData {
  skinType?: SkinType;
  concerns: SkinConcern[];
  goals?: string[];
  photoData?: string;
}

export interface ChatBubbleMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date | string;
}
