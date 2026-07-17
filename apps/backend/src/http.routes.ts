import { Elysia, t } from "elysia";
import { txtSplitByChunks } from "./utils/txtSplitter";
import { mdSplitByChunks } from "./utils/mdSplitter";
import { embedText } from "./gemini_tools/embedding";
import { db } from "./db";
import { documents, chunks as chunksTable } from "./db/schema";
import { eq } from "drizzle-orm";

export const app = new Elysia()
  .post(
  "/file_upload",
  async ({ body, set }) => {
    const file = body.file;

    if (!file) {
      set.status = 400;
      return { error: "No file uploaded" };
    }

    const fileExtension = file.name.split(".").pop() ?? "";

    let chunks: string[] = [];

    switch (fileExtension.toLowerCase()) {
      case "txt":
        const txtContent = await file.text();
        chunks = txtSplitByChunks(txtContent, 1000);
        break;
      case "md":
        const mdContent = await file.text();
        chunks = mdSplitByChunks(mdContent, 1000);
        break;
      default:
        set.status = 400;
        return { error: "Unsupported file type" };
    }

    const [documentRecord] = await db
      .insert(documents)
      .values({
        filename: file.name,
        contentType: file.type,
        status: "processing",
      })
      .returning();

    if (!documentRecord) {
      set.status = 500;
      return { error: "Failed to create document record" };
    }

    const embeddedChunks = await Promise.all(
      chunks.map(async (chunkText, index) => {
        const embedding = await embedText(chunkText);
        return { content: chunkText, chunkIndex: index, embedding };
      })
    );

    await db.insert(chunksTable).values(
      embeddedChunks.map((c) => ({
        documentId: documentRecord.id,
        content: c.content,
        chunkIndex: c.chunkIndex,
        embedding: c.embedding,
      }))
    );

    await db
      .update(documents)
      .set({ status: "ready" })
      .where(eq(documents.id, documentRecord.id));

    set.status = 200;
    return { message: "File processed successfully" };

  },
  {
    body: t.Object({
      file: t.File(),
    }),
  },
);
