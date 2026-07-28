import { forwardRef, useRef, type Dispatch, type SetStateAction } from "react";
import "./uploadModal.css";
import type { Document } from "@rag_app/shared";
import { uploadDocument } from "../api/documents";

type UploadModalProps = {
  setDocumentsInfo: Dispatch<SetStateAction<Document[]>>;
  trackDocument: (documentId: string) => void;
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Component that handles the upload of a file to the backend using a file input and the uploadDocument function.
// It's delcared with a fowardRef to pass the ref to the dialog element.
// It also recieves the setter for the documentsInfo array to update it when a file is uploaded.
export const UploadModal = forwardRef<HTMLDialogElement, UploadModalProps>(
  ({ setDocumentsInfo, trackDocument }, ref) => {
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

        if(file.size > MAX_SIZE) {
          alert("File size exceeds maximun (5MB)");
          return;
        }

        // Cleans the input and closed the modal as soon as posible
        fileInput.value = "";
        (document.querySelector("#upload-modal") as HTMLDialogElement)?.close();

        try {
          // Uploads the file and adds the response to the document list as processing
          const uploadRequest = await uploadDocument(file);
          setDocumentsInfo((prevDocuments) => [
            uploadRequest,
            ...prevDocuments,
          ]);

          // Starts tracking updates for the ready or failed status change
          trackDocument(uploadRequest.id);
        } catch (error) {
          alert("Uploading document");
        }
      } else {
        alert("Please select a file to upload.");
      }
    };

    return (
      <dialog className="upload-modal" id="upload-modal" ref={ref}>
        <div>
          <label htmlFor="file-input" className="file-input-label">
            Select a file to upload (txt or md):
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

