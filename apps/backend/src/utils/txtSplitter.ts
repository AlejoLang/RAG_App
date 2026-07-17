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

export const txtSplitByParagraphs = (text: string): string[] => {
  const paragraphs: string[] = text.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0);
  return paragraphs;
}