import { forwardRef, useRef, type Dispatch, type SetStateAction } from "react";
import "./uploadModal.css";
import type { Document } from "@rag_app/shared";
import { uploadDocument } from "../api/documents";

type UploadModalProps = {
  setDocumentsInfo: Dispatch<SetStateAction<Document[]>>;
};

// Component that handles the upload of a file to the backend using a file input and the uploadDocument function.
// It's delcared with a fowardRef to pass the ref to the dialog element.
// It alse recieves the setter for the documentsInfo array to update it when a file is uploaded.
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

        const uploadRequest = uploadDocument(file);

        // Once the uploadDocument dunction its called, the documentsInfo array is instantly 
        // updated with the processing status and the modal is closed
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

        // After the documentsInfo has been updated and the modal closed, it waits for the response from the backend
        // If an error occurred, the status value on documentsInfo its updated to failed.
        // If the file was uploaded successfully, the record of the document on documentsInfo is overwritten with the response from the
        //backend to update the id, uploadedAt and status properties.
        try {
          const document = await uploadRequest;
          if (!document) { // Catches fail on the backend
            console.error("Upload failed");
            setDocumentsInfo((prevDocuments) =>
              prevDocuments.map((doc) =>
                doc.filename === documentRecordPlaceholder.filename
                  ? { ...doc, status: "failed" }
                  : doc,
              ),
            );
            return;
          }
          setDocumentsInfo((prevDocuments) =>
            prevDocuments.map((doc) =>
              doc.filename === documentRecordPlaceholder.filename
                ? document
                : doc,
            ),
          );
        } catch (error) { // Catches fails on the query
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

