import { type NextRequest, NextResponse } from "next/server";
import type { GenerativeContentBlob } from "@google/generative-ai";
import type { SkinProfile, AIAnalysisResult } from "@/types";
import { getGeminiModel } from "@/lib/gemini";
import { loadProductDatabase } from "@/lib/productDB";

const SYSTEM_INSTRUCTION = `You are a licensed dermatologist and expert skincare advisor with deep knowledge of Korean, Chinese, Japanese, and American skincare philosophies. You understand ingredient interactions (Vitamin C in AM only, retinol PM only, do not layer certain actives). You give warm, specific, non-generic advice tailored to the individual.`;

const JSON_OUTPUT_INSTRUCTION = `Return ONLY a raw JSON object matching this exact structure — no markdown, no backticks, no explanation:
{ "skinAssessment": string, "routine": { "morning": [], "evening": [] }, "warnings": [], "generalAdvice": string }

Each array element in morning and evening must be: { "order": number, "product": <full product object from the list below>, "usage": string, "frequency": string, "tip": string }. Use only products from the provided list; copy the full product object into each step.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const { skinType, concerns, goals, photoBase64 } = body as SkinProfile;
    const products = loadProductDatabase().products;

    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (photoBase64) {
      if (photoBase64.startsWith("data:")) {
        const match = /^data:(.+?);base64,(.+)$/.exec(photoBase64);
        if (match) {
          imageMimeType = match[1];
          imageBase64 = match[2];
        } else {
          imageBase64 = photoBase64;
        }
      } else {
        imageBase64 = photoBase64;
      }
    }

    const imagePart: { inlineData: GenerativeContentBlob } | null =
      imageBase64
        ? {
            inlineData: {
              mimeType: imageMimeType ?? "image/jpeg",
              data: imageBase64,
            },
          }
        : null;

    const userContext = [
      "User profile:",
      `Skin type: ${skinType}`,
      `Concerns: ${concerns.join(", ")}`,
      `Goals: ${goals.join(", ")}`,
    ].join("\n");

    const productsContext = `Available products (use only these; include the full product object in each routine step):\n${JSON.stringify(products)}`;

    const textPart = {
      text: [
        userContext,
        "",
        productsContext,
        "",
        JSON_OUTPUT_INSTRUCTION,
      ].join("\n"),
    };

    const parts = imagePart ? [imagePart, textPart] : [textPart];

    const model = getGeminiModel();
    const result = await model.generateContent({
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [{ role: "user", parts }],
    });

    const response = result.response;
    const rawText = response.text?.() ?? "";

    if (!rawText) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      );
    }

    const cleaned = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned) as AIAnalysisResult;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("ANALYZE ERROR:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: String(error) },
      { status: 500 }
    );
  }
}
