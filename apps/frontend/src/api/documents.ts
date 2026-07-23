import type { Document } from "@rag_app/shared";

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/file_upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const { documentRecord } = await response.json();

  return documentRecord;
}

export async function getDocuments() {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/documents_info");
    if (!response.ok) {
      throw new Error("Failed to fetch documents info");
    }
    const data: Document[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching documents info:", error);
    return [];
  }
}