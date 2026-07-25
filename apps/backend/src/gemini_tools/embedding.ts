import { GoogleGenAI, type GoogleGenAIOptions } from "@google/genai";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

// Creates an embedding from a text
// Takes the text as string and ouputs a vector with the embedding or a empty vector on fail
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
