import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Returns the Gemini 2.0 Flash model for analysis.
 * Throws if GEMINI_API_KEY is not set.
 */
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}
