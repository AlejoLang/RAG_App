# RAG App

Simple RAG app for uploading documents, chatting with them, and checking processing status.

Demo: https://rag-app-frontend-three.vercel.app/

## What it does

- Uploads `.txt` and `.md` files.
- Processes content in the background.
- Lets you ask questions about uploaded documents.
- Shows the document list and its status.

## Structure

- `apps/backend`: API, document processing, and queries.
- `apps/frontend`: web interface.
- `packages/shared`: shared types between frontend and backend.

## Scripts

From the root:

- `bun run dev:backend` to start the backend.
- `bun run dev:frontend` to start the frontend.
- `bun run typecheck` to validate backend types.
- `bun run lint` to lint the frontend.
- `bun run build` to build the frontend.
- `bun run check` to run the basic checks.

## Tech Stack

- Bun
- Elysia
- React
- Vite
- Drizzle ORM
- Vitest

## Notes

The app works with text and markdown files only for now.

