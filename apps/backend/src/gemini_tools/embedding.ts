import { GoogleGenAI, type GoogleGenAIOptions } from "@google/genai";
import { aiQueue } from "./aiQueue";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

// Creates an embedding from a text
// Takes the text as string and ouputs a vector with the embedding or a empty vector on fail
async function _embedText (text: string): Promise<number[]> {
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

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function embedText(text: string) {
  return aiQueue.enqueue(() => _embedText(text), estimateTokens(text));
}