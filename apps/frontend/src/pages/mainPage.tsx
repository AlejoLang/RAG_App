import { useEffect, useRef, useState } from "react";
import { ChatBox } from "../components/chatBox";
import { MainSideBar } from "../components/mainSideBar";
import { UploadModal } from "../components/uploadModal";
import type { Document } from "@rag_app/shared";
import "./mainPage.css";

export const MainPage = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [documentsInfo, setDocumentsInfo] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocumentsInfo = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/documents_info");
        if (!response.ok) {
          throw new Error("Failed to fetch documents info");
        }
        const data: Document[] = await response.json();
        setDocumentsInfo(data);
      } catch (error) {
        console.error("Error fetching documents info:", error);
      }
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

