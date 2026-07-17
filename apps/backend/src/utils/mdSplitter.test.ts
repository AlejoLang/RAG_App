import { describe, it, expect } from "vitest";
import {
  mdSplitByChunks,
  mdSplitBySubtitles,
  mdSplitByTitles,
} from "./mdSplitter";

describe("mdSplitByChunks", () => {
  it("splits text into chunks of the requested size", () => {
    const text = "abcde12345";
    expect(mdSplitByChunks(text, 3)).toEqual(["abc", "de1", "234", "5"]);
  });

  it("returns an empty array for empty input", () => {
    expect(mdSplitByChunks("", 3)).toEqual([]);
  });

  it("returns the whole text if chunk size is larger than text length", () => {
    const text = "abcde";
    expect(mdSplitByChunks(text, 10)).toEqual(["abcde"]);
  });

  it("handles chunk size of 1", () => {
    const text = "abcde";
    expect(mdSplitByChunks(text, 1)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("handles chunk size equal to text length", () => {
    const text = "abcde";
    expect(mdSplitByChunks(text, 5)).toEqual(["abcde"]);
  });

  it("handles chunk size of 0", () => {
    const text = "abcde";
    expect(mdSplitByChunks(text, 0)).toEqual([]);
  });

  it("handles negative chunk size", () => {
    const text = "abcde";
    expect(mdSplitByChunks(text, -1)).toEqual([]);
  });

  it("handles splitting text with newlines", () => {
    const text = "abc\ndef\nghi";
    expect(mdSplitByChunks(text, 4)).toEqual(["abc\n", "def\n", "ghi"]);
  });

  it("handles splitting text with special characters", () => {
    const text = "abc!@#def$%^ghi&*()";
    expect(mdSplitByChunks(text, 5)).toEqual([
      "abc!@",
      "#def$",
      "%^ghi",
      "&*()",
    ]);
  });

  it("splits markdown by top-level titles", () => {
    const text =
      "#Title\n##Subtitle\nContent\n#Another Title\n##Another Subtitle\nMore Content";
    expect(mdSplitByTitles(text)).toEqual([
      "#Title\n##Subtitle\nContent",
      "#Another Title\n##Another Subtitle\nMore Content",
    ]);
  });

  it("splits markdown by subtitles", () => {
    const text =
      "##Subtitle1\nContent1\n##Subtitle2\nContent2\n##Subtitle3\nContent3";
    expect(mdSplitBySubtitles(text)).toEqual([
      "##Subtitle1\nContent1",
      "##Subtitle2\nContent2",
      "##Subtitle3\nContent3",
    ]);
  });
});

describe("mdSplitByTitles", () => {
  it("splits markdown by top-level titles", () => {
    const text =
      "#Title\n##Subtitle\nContent\n#Another Title\n##Another Subtitle\nMore Content";
    expect(mdSplitByTitles(text)).toEqual([
      "#Title\n##Subtitle\nContent",
      "#Another Title\n##Another Subtitle\nMore Content",
    ]);
  });
});

describe("mdSplitBySubtitles", () => {
  it("splits markdown by subtitles", () => {
    const text =
      "##Subtitle1\nContent1\n##Subtitle2\nContent2\n##Subtitle3\nContent3";
    expect(mdSplitBySubtitles(text)).toEqual([
      "##Subtitle1\nContent1",
      "##Subtitle2\nContent2",
      "##Subtitle3\nContent3",
    ]);
  });
});
