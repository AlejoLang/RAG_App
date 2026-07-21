import { useEffect } from "react";
import "./mainSideBar.css";
import type { Document } from "@rag_app/shared";

export const MainSideBar = ({
  modalRef,
  documentsInfo,
}: {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  documentsInfo: Document[];
}) => {
  const handleUploadClick = () => {
    if (modalRef?.current) {
      modalRef.current.showModal();
    }
  };


  return (
    <div className="main-sidebar">
      <button className="open-upload-form-button" onClick={handleUploadClick}>
        Upload File
      </button>
      <div className="uploaded-files">
        <h3>Recently Uploaded Files</h3>
        <ul>
          {documentsInfo?.map((file, index) => (
            <li key={index} className="file-title">
              {file.filename}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

