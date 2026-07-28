// Splits a md text based on a fixed chunk size
export const txtSplitByChunks = (text: string, chunkSize: number): string[] => {
  const chunks: string[] = [];
  if(chunkSize <= 0) {
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

// Splits a text based on paragraphs
export const txtSplitByParagraphs = (text: string): string[] => {
  const paragraphs: string[] = text.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0);
  return paragraphs;
}

// Splits a text based on paragraphs and then joins paragraphs to reach a certain chunk size
export const txtSplitByParagraphsToChunks = (text: string, chunkSize: number): string[] => {
  if (chunkSize <= 0) {
    return [];
  }
  const paragraphs = txtSplitByParagraphs(text);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If a single paragraph alone exceeds chunkSize, flush current chunk
    // and hard-split the paragraph itself.
    if (paragraph.length >= chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      chunks.push(...txtSplitByChunks(paragraph, chunkSize));
      continue;
    }

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