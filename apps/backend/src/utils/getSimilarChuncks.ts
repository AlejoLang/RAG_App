import type { Chunk } from "@rag_app/shared";
import { db } from "../db";
import { chunks } from "../db/schema";
import { cosineDistance } from "drizzle-orm";

export const getSimilarChunks = async (embedding: number[], limit: number = 5) => {
  const similarChunks = await db
    .select()
    .from(chunks)
    .orderBy(cosineDistance(chunks.embedding, embedding))
    .limit(limit);

  return similarChunks;
}