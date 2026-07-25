import { useEffect, useRef, useState } from "react";
import { ChatBox } from "../components/chatBox";
import { MainSideBar } from "../components/mainSideBar";
import { UploadModal } from "../components/uploadModal";
import type { Document } from "@rag_app/shared";
import "./mainPage.css";
import { getDocuments } from "../api/documents";

// Holds all the main components (UploadModal, MainSideBar and ChatBox) on a grided container.
// It als holds the documentsInfo array that gets updated on mount and the reference to the modal.
export const MainPage = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [documentsInfo, setDocumentsInfo] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocumentsInfo = async () => {
      const data = await getDocuments();
      setDocumentsInfo(data);
    };

    fetchDocumentsInfo();
  }, []);

  return (
    <div className="main-page">
      <UploadModal ref={modalRef} setDocumentsInfo={setDocumentsInfo} />
      <MainSideBar modalRef={modalRef} documentsInfo={documentsInfo} />
      <ChatBox />
    </div>
  );
};

