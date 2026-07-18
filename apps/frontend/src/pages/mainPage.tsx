import { useRef } from "react";
import { ChatBox } from "../components/chatBox";
import { MainSideBar } from "../components/mainSideBar";
import { UploadModal } from "../components/uploadModal";
import "./mainPage.css";

export const MainPage = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="main-page">
      <UploadModal ref={modalRef} />
      <MainSideBar modalRef={modalRef} />
      <ChatBox />
    </div>
  );
};

