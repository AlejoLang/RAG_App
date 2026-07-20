import { describe, it, expect } from "vitest";
import {
  txtSplitByChunks,
  txtSplitByParagraphs,
  txtSplitByParagraphsToChunks,
} from "./txtSplitter";

describe("txtSplitByChunks", () => {
  it("splits text into chunks of the requested size", () => {
    const text = "abcde12345";
    expect(txtSplitByChunks(text, 3)).toEqual(["abc", "de1", "234", "5"]);
  });

  it("returns an empty array for empty input", () => {
    expect(txtSplitByChunks("", 3)).toEqual([]);
  });

  it("returns the whole text if chunk size is larger than text length", () => {
    const text = "abcde";
    expect(txtSplitByChunks(text, 10)).toEqual(["abcde"]);
  });

  it("handles chunk size of 1", () => {
    const text = "abcde";
    expect(txtSplitByChunks(text, 1)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("handles chunk size equal to text length", () => {
    const text = "abcde";
    expect(txtSplitByChunks(text, 5)).toEqual(["abcde"]);
  });

  it("handles chunk size of 0", () => {
    const text = "abcde";
    expect(txtSplitByChunks(text, 0)).toEqual([]);
  });

  it("handles negative chunk size", () => {
    const text = "abcde";
    expect(txtSplitByChunks(text, -1)).toEqual([]);
  });

  it("handles splitting text with newlines", () => {
    const text = "abc\ndef\nghi";
    expect(txtSplitByChunks(text, 4)).toEqual(["abc\n", "def\n", "ghi"]);
  });

  it("handles splitting text with special characters", () => {
    const text = "abc!@#def$%^ghi&*()";
    expect(txtSplitByChunks(text, 5)).toEqual([
      "abc!@",
      "#def$",
      "%^ghi",
      "&*()",
    ]);
  });
});

describe("txtSplitByParagraphs", () => {
  it("splits text into paragraphs", () => {
    const text = "Paragraph 1\n\nParagraph 2\n\nParagraph 3";
    expect(txtSplitByParagraphs(text)).toEqual([
      "Paragraph 1",
      "Paragraph 2",
      "Paragraph 3",
    ]);
  });

  it("trims whitespace from paragraphs", () => {
    const text = "   Paragraph 1   \n\n   Paragraph 2   ";
    expect(txtSplitByParagraphs(text)).toEqual([
      "Paragraph 1",
      "Paragraph 2",
    ]);
  });

  it("ignores empty paragraphs", () => {
    const text = "Paragraph 1\n\n\n\nParagraph 2";
    expect(txtSplitByParagraphs(text)).toEqual([
      "Paragraph 1",
      "Paragraph 2",
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(txtSplitByParagraphs("")).toEqual([]);
  });
});

describe("txtSplitByParagraphsToChunks", () => {
  it("splits text into chunks of the requested size", () => {
    const text = "Paragraph 1\n\nParagraph 2\n\nParagraph 3";
    expect(txtSplitByParagraphsToChunks(text, 20)).toEqual([
      "Paragraph 1\n\nParagraph 2",
      "Paragraph 3",
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(txtSplitByParagraphsToChunks("", 20)).toEqual([]);
  });

  it("returns the whole text if chunk size is larger than text length", () => {
    const text = "Paragraph 1\n\nParagraph 2";
    expect(txtSplitByParagraphsToChunks(text, 50)).toEqual([
      "Paragraph 1\n\nParagraph 2",
    ]);
  });

  it("returns an empty array for chunk size of 0", () => {
    const text = "Paragraph 1\n\nParagraph 2\n\nParagraph 3";
    expect(txtSplitByParagraphsToChunks(text, 0)).toEqual([]);
  });
  
  it("returns an empty array for negative chunk size", () => {
    const text = "Paragraph 1\n\nParagraph 2\n\nParagraph 3";
    expect(txtSplitByParagraphsToChunks(text, -5)).toEqual([]);
  });
});
