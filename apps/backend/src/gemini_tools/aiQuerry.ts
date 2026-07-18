import { config } from "dotenv";
import { GoogleGenAI, type GoogleGenAIOptions } from "@google/genai";
config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

export const aiQuery = async (
  query: string,
  clues: string[],
): Promise<string> => {
  const options: GoogleGenAIOptions = {
    apiKey: GOOGLE_API_KEY,
  };
  const ai = new GoogleGenAI(options);

  const prompt = `You are a helpful assistant. Use ONLY the following clues to answer the query, is not necessary to use the exact words neither mention the clues directly: ${clues.join(", ")}. Query: ${query}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });
  return response.text ?? "No response generated.";
};
