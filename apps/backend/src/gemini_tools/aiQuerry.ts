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
  if (!clues || clues.length === 0) {
    return "ERROR: No clues provided.";
  }
  const ai = new GoogleGenAI(options);

  const prompt = `You are a helpful assistant. Use ONLY the following clues to answer the query, is not necessary to use the exact words neither mention the clues directly, if the question is in another languaje than the one used in the clues, translate it to the language of the question: ${clues.join(", ")}. Query: ${query}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });
  return response.text ?? "ERROR: No response generated.";
};

