import { describe, it, expect, vi } from "vitest";
import { httpRoutes } from "./http.routes";
import { embedText } from "./gemini_tools/embedding";
import { db } from "./db";
import { afterEach } from "vitest";
import { sql } from "drizzle-orm";


vi.mock("./gemini_tools/embedding", () => ({
  embedText: vi.fn().mockResolvedValue(new Array(768).fill(0.1)),
}));

afterEach(async () => {
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
      new File(["This is a test text file."], "file.txt"),
    );

    const response = await httpRoutes.handle(
      new Request("http://localhost/file_upload", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: "File processed successfully"
    });
  });

  it("processes a .md file", async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new File(["# Title\n\nThis is a test markdown file."], "file.md"),
    );

    const response = await httpRoutes.handle(
      new Request("http://localhost/file_upload", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: "File processed successfully"
    });
  });
});

