import "./mainSideBar.css";
import type { Document } from "@rag_app/shared";
import { DocumentsList } from "./DocumentsList";

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
        <DocumentsList documentsInfo={documentsInfo} />
      </div>
    </div>
  );
};

