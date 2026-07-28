import { Elysia, t } from "elysia";
import { txtSplitByParagraphsToChunks } from "./utils/txtSplitter";
import { mdSplitByParagraphsToChunks } from "./utils/mdSplitter";
import { embedText } from "./gemini_tools/embedding";
import { db } from "./db";
import { documents } from "./db/schema";
import { desc } from "drizzle-orm";
import { getSimilarChunks } from "./utils/getSimilarChuncks";
import { aiQuery } from "./gemini_tools/aiQuerry";
import { documentEvents } from "./events/documentEmitter";
import { processDocumentEmbedding } from "./utils/processDocumentEmbedding";

const MAX_SIZE = 5 * 1024 * 1024;

export const httpRoutes = new Elysia()
  .post(
    "/file_upload",
    async ({ body, set }) => {
      const file = body.file;

      if (!file) {
        set.status = 400;
        return { error: "No file uploaded" };
      }

      if(file.size > MAX_SIZE) {
        set.status = 413;
        return { error: "File size exceeds maximun" }
      }

      const fileExtension = file.name.split(".").pop() ?? "";
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

      let chunks: string[] = [];

      switch (fileExtension.toLowerCase()) {
        case "txt":
          const txtContent = await file.text();
          chunks = txtSplitByParagraphsToChunks(txtContent, 1000);
          break;
        case "md":
          const mdContent = await file.text();
          chunks = mdSplitByParagraphsToChunks(mdContent, 1000);
          break;
        default:
          set.status = 400;
          return { error: "Unsupported file type" };
      }

      // First, inserts the the record with the processing status as it has not been embedded
      const [documentRecord] = await db
        .insert(documents)
        .values({
          filename: fileNameWithoutExtension,
          contentType: file.type,
          status: "processing",
        })
        .returning();

      if (!documentRecord) {
        set.status = 500;
        return { error: "Failed to create document record" };
      }

      processDocumentEmbedding(documentRecord.id, chunks);

      set.status = 202;
      return { documentRecord };
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    },
  )
  .post(
    "/query",
    async ({ body, set }) => {
      const { query } = body;

      if (!query) {
        set.status = 400;
        return { error: "No query provided" };
      }

      // Embeds the querry to search for similar text
      const embedding = await embedText(query);

      // Searches on the database for chunck with similar meaning as the query
      const similarChunks = getSimilarChunks(embedding, 5);
      const similarChunksContent = (await similarChunks).map(
        (chunk) => chunk.content,
      );

      // Makes a call to the ai using the the query and the similar chuncks as clues
      const response = await aiQuery(query, similarChunksContent);

      set.status = 200;
      return { response };
    },
    {
      body: t.Object({
        query: t.String(),
      }),
    },
  )
  .get("/documents_info", async () => {
    const documentsInfo = await db
      .select()
      .from(documents)
      .orderBy(desc(documents.uploadedAt));
    return documentsInfo;
  })
  .get("/documents/:id/status_stream", ({ params, request }) => {
    const documentId = params.id;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ status: "processing" })}\n\n`),
        );

        const onEvent = (event: { status: string }) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
          controller.close();
        };

        documentEvents.once(documentId, onEvent);

        request.signal.addEventListener("abort", () => {
          documentEvents.removeListener(documentId, onEvent);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  });

