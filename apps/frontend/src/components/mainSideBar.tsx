import "./mainSideBar.css";
import type { Document } from "@rag_app/shared";
import { DocumentsList } from "./DocumentsList";

// Component that encapsulates the button that opens up the upload file modal and the documents list
// It recieves the reference to the modal to be able to open it as well as the list of documents to pass to the DocumentsList component
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

