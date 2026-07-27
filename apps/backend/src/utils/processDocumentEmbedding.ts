import { eq } from "drizzle-orm";
import { db } from "../db";
import { embedText } from "../gemini_tools/embedding";
import { documents, chunks as chunksTable } from "../db/schema";
import { documentEvents } from "../events/documentEmitter";

export async function processDocumentEmbedding(
  documentId: string,
  chunks: string[],
) {
  try {
    const embeddedChunks = await Promise.all(
      chunks.map(async (chunkText, index) => {
        const embedding = await embedText(chunkText);
        return { content: chunkText, chunkIndex: index, embedding };
      }),
    );

    await db.insert(chunksTable).values(
      embeddedChunks.map((c) => ({
        documentId,
        content: c.content,
        chunkIndex: c.chunkIndex,
        embedding: c.embedding,
      })),
    );

    await db
      .update(documents)
      .set({ status: "ready" })
      .where(eq(documents.id, documentId));
    
    documentEvents.emit(String(documentId), { status: "ready" });
  } catch (err) {
    console.error(`Embedding failed for document ${documentId}:`, err);
    await db
      .update(documents)
      .set({ status: "failed" })
      .where(eq(documents.id, documentId));

    documentEvents.emit(String(documentId), { status: "failed" });
  }
}
