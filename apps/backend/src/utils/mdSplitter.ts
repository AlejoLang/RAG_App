export const mdSplitByChunks = (text: string, chunkSize: number): string[] => {
  const chunks: string[] = [];
  if (chunkSize <= 0) {
    return chunks;
  }
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    chunks.push(text.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  return chunks;
};

export const mdSplitByParagraphs = (text: string): string[] => {
  const paragraphs: string[] = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  return paragraphs;
};

export const mdSplitByTitles = (text: string): string[] => {
  // Function should split the text into chunks based on titles (lines starting with #)
  const titles: string[] = text
    .split(/\n(?=#[^#])/)
    .map((title) => title.trim())
    .filter((title) => title.length > 0);
  return titles;
};

export const mdSplitBySubtitles = (text: string): string[] => {
  const subtitles: string[] = text
    .split(/\n(?=##[^#])/)
    .map((subtitle) => subtitle.trim())
    .filter((subtitle) => subtitle.length > 0);
  return subtitles;
};

export const mdSplitByParagraphsToChunks = (
  text: string,
  chunkSize: number,
): string[] => {
  if (chunkSize <= 0) {
    return [];
  }
  const paragraphs = mdSplitByParagraphs(text);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    currentChunk += (currentChunk ? "\n\n" : "") + paragraph;

    if (currentChunk.length >= chunkSize) {
      chunks.push(currentChunk);
      currentChunk = "";
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};

