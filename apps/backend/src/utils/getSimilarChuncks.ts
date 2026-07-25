import type { Chunk } from "@rag_app/shared";
import { db } from "../db";
import { chunks } from "../db/schema";
import { cosineDistance } from "drizzle-orm";

// Uses pgvector to get the most similar chunks based on a embedding
// Takes the embedding an a limit of similar chunks to return
export const getSimilarChunks = async (embedding: number[], limit: number = 5) => {
  const similarChunks = await db
    .select()
    .from(chunks)
    .orderBy(cosineDistance(chunks.embedding, embedding))
    .limit(limit);

  return similarChunks;
}