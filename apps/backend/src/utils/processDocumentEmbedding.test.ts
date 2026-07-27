import { describe, it, expect, vi } from "vitest";
import { processDocumentEmbedding } from "./processDocumentEmbedding";
import { db } from "../db";
import { documents, chunks as chuncksTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { embedText } from "../gemini_tools/embedding";

vi.mock("../gemini_tools/embedding", () => ({
  embedText: vi.fn().mockResolvedValue(new Array(768).fill(0.1)),
}));

describe("processDocumentEmbedding", () => {
  it("processes document embedding and updates status to ready", async () => {
    const documentId = randomUUID();
    const chunks = ["chunk1", "chunk2"];

    // Insert a document record with status "processing"
    await db.insert(documents).values({
      id: documentId,
      filename: "test.txt",
      contentType: "text/plain",
      status: "processing",
    });

    await processDocumentEmbedding(documentId, chunks);

    // Check that the document status is updated to "ready"
    const document = await db.select().from(documents).where(eq(documents.id, documentId));
    expect(document[0]?.status).toBe("ready");

    // Check that the chunks are stored
    const storedChunks = await db.select().from(chuncksTable).where(eq(chuncksTable.documentId, documentId));
    expect(storedChunks.length).toBe(chunks.length);
  });

  it("handles errors and updates status to failed", async () => {
    const documentId = randomUUID();
    const chunks = ["chunk1", "chunk2"];

    // Insert a document record with status "processing"
    await db.insert(documents).values({
      id: documentId,
      filename: "test.txt",
      contentType: "text/plain",
      status: "processing",
    });

    // Mock embedText to throw an error
    vi.mocked(embedText).mockImplementationOnce(() => {
      throw new Error("Embedding failed");
    });

    await processDocumentEmbedding(documentId, chunks);

    // Check that the document status is updated to "failed"
    const document = await db.select().from(documents).where(eq(documents.id, documentId));
    expect(document[0]?.status).toBe("failed");
  });
});