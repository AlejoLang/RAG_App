import { forwardRef, useRef, type Dispatch, type SetStateAction } from "react";
import "./uploadModal.css";
import type { Document } from "@rag_app/shared";

type UploadModalProps = {
  setDocumentsInfo: Dispatch<SetStateAction<Document[]>>;
};

export const UploadModal = forwardRef<HTMLDialogElement, UploadModalProps>(
  ({ setDocumentsInfo }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
      const fileInput = fileInputRef?.current;
      if (fileInput && fileInput?.files && fileInput?.files?.length > 0) {
        const file = fileInput.files[0];
        const fileExtension = file.name.split(".").pop() ?? "";
        if (!["txt", "md"].includes(fileExtension.toLowerCase())) {
          alert("Unsupported file type. Please upload a .txt or .md file.");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);

        const uploadRequest = fetch(
          import.meta.env.VITE_BACKEND_URL + "/file_upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const documentRecordPlaceholder: Document = {
          id: "-1",
          filename: file.name,
          contentType: file.type,
          uploadedAt: new Date().toISOString(),
          status: "processing",
        };

        fileInput.value = "";
        (document.querySelector("#upload-modal") as HTMLDialogElement)?.close();
        setDocumentsInfo((prevDocuments) => [
          documentRecordPlaceholder,
          ...prevDocuments,
        ]);

        try {
          const response = await uploadRequest;
          if (!response.ok) {
            console.error("Upload failed:", response.statusText);
            setDocumentsInfo((prevDocuments) =>
              prevDocuments.map((doc) =>
                doc.filename === documentRecordPlaceholder.filename
                  ? { ...doc, status: "failed" }
                  : doc,
              ),
            );
            return;
          }
          const { documentRecord }: { documentRecord: Document } =
            await response.json();
          setDocumentsInfo((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc.filename === documentRecordPlaceholder.filename
                ? documentRecord
                : doc,
            ),
          );
        } catch (error) {
          console.error("Upload failed:", error);
          setDocumentsInfo((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc.filename === documentRecordPlaceholder.filename
                ? { ...doc, status: "failed" }
                : doc,
            ),
          );
        }
      } else {
        alert("Please select a file to upload.");
      }
    };

    return (
      <dialog className="upload-modal" id="upload-modal" ref={ref}>
        <div>
          <label htmlFor="file-input" className="file-input-label">
            Select a file to upload:
          </label>
          <input
            type="file"
            id="file-input"
            className="file-input"
            accept=".txt,.md"
            ref={fileInputRef}
          />
        </div>
        <button
          id="upload-button"
          className="upload-button"
          onClick={handleUpload}
        >
          Upload
        </button>
      </dialog>
    );
  },
);

