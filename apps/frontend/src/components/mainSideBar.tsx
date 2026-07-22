import { useEffect } from "react";
import "./mainSideBar.css";
import type { Document } from "@rag_app/shared";
import { typeToCompact } from "../utils/typeToCompact";

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
        <ul className="uploaded-files-list">
          {documentsInfo?.map((file, index) => (
            <li key={index} className="file-info">
              <div className="file-title">{file.filename}</div>
              <div className="file-type">{typeToCompact(file.contentType)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

