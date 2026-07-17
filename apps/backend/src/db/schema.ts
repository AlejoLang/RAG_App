import { pgTable, uuid, text, timestamp, integer, vector } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  contentType: text('content_type').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  status: text('status', { enum: ['processing', 'ready', 'failed'] }).notNull().default('processing'),
});

export const chunks = pgTable('chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
  pageNumber: integer('page_number'),
  sectionTitle: text('section_title'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});