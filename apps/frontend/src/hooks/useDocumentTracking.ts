import { useCallback, useRef } from "react";
import type { Document } from "@rag_app/shared";
import type { Dispatch, SetStateAction } from "react";

export function useDocumentTracking(
  setDocumentsInfo: Dispatch<SetStateAction<Document[]>>,
) {
  const activeStreams = useRef<Map<string, EventSource>>(new Map());

  const trackDocument = useCallback(
    (documentId: string) => {
      if (activeStreams.current.has(documentId)) return;

      const eventSource = new EventSource(
        import.meta.env.VITE_BACKEND_URL + `/documents/${documentId}/status_stream`,
      );
      activeStreams.current.set(documentId, eventSource);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.status === "ready" || data.status === "failed") {
          setDocumentsInfo((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc.id === documentId ? { ...doc, status: data.status } : doc,
            ),
          );
          eventSource.close();
          activeStreams.current.delete(documentId);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        activeStreams.current.delete(documentId);
      };
    },
    [setDocumentsInfo],
  );

  return { trackDocument };
}