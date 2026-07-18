import { forwardRef, useRef } from "react";
import "./uploadModal.css";

export const UploadModal = forwardRef<HTMLDialogElement>((_, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

  const handleUpload = async () => {
    const fileInput = fileInputRef?.current;
    if (fileInput && fileInput?.files && fileInput?.files?.length > 0) {
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${backendUrl}/file_upload`, {
        method: "POST",
        body: formData,
      });
      fileInput.value = "";
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
});

