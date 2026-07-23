import { describe, it, expect, vi } from "vitest";
import { httpRoutes } from "./http.routes";
import { db } from "./db";
import { afterEach } from "vitest";
import { sql } from "drizzle-orm";


vi.mock("./gemini_tools/embedding", () => ({
  embedText: vi.fn().mockResolvedValue(new Array(768).fill(0.1)),
}));

afterEach(async () => {
  if (!process.env.DATABASE_URL?.includes("test")) {
    throw new Error(
      `Refusing to clean database: ${process.env.DATABASE_URL}`
    );
  }

  await db.execute(sql`TRUNCATE documents, chunks CASCADE`);
});

describe("POST /file_upload", () => {
  it("returns an error for unsupported file types", async () => {
    const formData = new FormData();
    formData.append("file", new File(["content"], "file.unsupported"));

    const response = await httpRoutes.handle(
      new Request("http://localhost/file_upload", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: "Unsupported file type" });
  });

  it("returns an error when no file is uploaded", async () => {
    const formData = new FormData();

    const response = await httpRoutes.handle(
      new Request("http://localhost/file_upload", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data).toEqual({
      type: "validation",
      on: "body",
      property: "/file",
      message: "Expected kind 'File'",
      summary: "Expected kind 'File'",
      expected: {
        file: "File",
      },
      found: {},
      errors: [
        {
          summary: "Expected kind 'File'",
          type: 31,
          schema: {
            default: "File",
            type: "string",
            format: "binary",
          },
          path: "/file",
          message: "Expected kind 'File'",
          errors: [],
        },
      ],
    });
  });

  it("processes a .txt file", async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new File(["This is a test text file."], "file.txt", { type: "text/plain" }),
    );

    const response = await httpRoutes.handle(
      new Request("http://localhost/file_upload", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data).toEqual(
      expect.objectContaining({
        documentRecord: expect.objectContaining({
          id: expect.any(String),
          filename: "file",
          contentType: "text/plain",
          status: "ready",
          uploadedAt: expect.any(String),
        }),
      })
    );
  });

  it("processes a .md file", async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new File(["# Title\n\nThis is a test markdown file."], "file.md", { type: "text/markdown" }),
    );

    const response = await httpRoutes.handle(
      new Request("http://localhost/file_upload", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(
      expect.objectContaining({
        documentRecord: expect.objectContaining({
          id: expect.any(String),
          filename: "file",
          contentType: "text/markdown",
          status: "ready",
          uploadedAt: expect.any(String),
        }),
      })
    );
  });
});

