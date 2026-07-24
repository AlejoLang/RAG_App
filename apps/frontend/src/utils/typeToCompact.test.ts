import { describe, it, expect } from "vitest";
import { typeToCompact } from "./typeToCompact";

describe("typeToCompact", () => {
  it("returns the correct string for plain text", () => {
    expect(typeToCompact("text/plain")).toBe("TXT");
    expect(typeToCompact("text/plain;charset=utf-8")).toBe("TXT");
  });
  it("returns the correct string for markdown", () => {
    expect(typeToCompact("text/markdown")).toBe("MD");
    expect(typeToCompact("text/markdown;charset=utf-8")).toBe("MD");
    expect(typeToCompact("text/x-markdown")).toBe("MD");
  });
  it("returns the correct string for PDF", () => {
    expect(typeToCompact("application/pdf")).toBe("PDF");
  });
  it("returns 'UNK' for unknown types", () => {
    expect(typeToCompact("image/png")).toBe("UNK");
    expect(typeToCompact("application/json")).toBe("UNK");
  });
});