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
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/file_upload', {
          method: "POST",
          body: formData,
        });
        const {documentRecord}: { documentRecord: Document } = await response.json();
        fileInput.value = "";
        setDocumentsInfo((prevDocuments) => [documentRecord, ...prevDocuments]);
        console.log("Upload response:", response);
        alert("File uploaded successfully!");
      } else {
        console.log("No file selected for upload.");
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

