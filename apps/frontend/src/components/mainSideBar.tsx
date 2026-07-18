import { useEffect, useState } from "react";
import "./mainSideBar.css";
import type { Document } from "@rag_app/shared";

export const MainSideBar = ({
  modalRef,
}: {
  modalRef: React.RefObject<HTMLDialogElement> | null;
}) => {
  const [documentsInfo, setDocumentsInfo] = useState<Document[]>([]);

  const handleUploadClick = () => {
    if (modalRef?.current) {
      modalRef.current.showModal();
    }
  };

  useEffect(() => {
    const fetchDocumentsInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"}/documents_info`,
        );
        if (response.ok) {
          const data = await response.json();
          setDocumentsInfo(data);
        } else {
          console.error(
            "Failed to fetch recently uploaded files:",
            response.statusText,
          );
        }
      } catch (error) {
        console.error("Error fetching recently uploaded files:", error);
      }
    };

    fetchDocumentsInfo();
  }, []);

  return (
    <div className="main-sidebar">
      <button className="open-upload-form-button" onClick={handleUploadClick}>
        Upload File
      </button>
      <div className="uploaded-files">
        <h3>Recently Uploaded Files</h3>
        <ul>
          {documentsInfo?.map((file, index) => (
            <li key={index} className="file-title">{file.filename}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

