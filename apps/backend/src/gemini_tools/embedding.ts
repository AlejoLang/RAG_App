import { config } from "dotenv";
import { GoogleGenAI, type GoogleGenAIOptions } from "@google/genai";
config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

export const embedText = async (text: string): Promise<number[]> => {
  const options: GoogleGenAIOptions = {
    apiKey: GOOGLE_API_KEY,
  };
  const ai = new GoogleGenAI(options);
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: { outputDimensionality: 768 },
  });
  return response.embeddings?.[0]?.values ?? [];
};
