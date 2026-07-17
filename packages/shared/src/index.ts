export type Document = {
  id: string;
  filename: string;
  contentType: string;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'failed';
};

export type Chunk = {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  pageNumber?: number;
  sectionTitle?: string;
};