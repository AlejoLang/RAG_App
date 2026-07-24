import { describe, it, expect, vi } from "vitest";
import { MainSideBar } from "./mainSideBar";
import type { Document } from "@rag_app/shared";
import { render } from "@testing-library/react";

const mockDocumentsInfo: Document[] = [
    {
      id: "1",
      filename: "file1",
      contentType: "text/plain",
      status: "ready",
      uploadedAt: new Date().toDateString(),
    },
    {
      id: "2",
      filename: "file2",
      contentType: "text/plain",
      status: "processing",
      uploadedAt: new Date().toDateString(),
    },
    {
      id: "3",
      filename: "file3",
      contentType: "text/plain",
      status: "failed",
      uploadedAt: new Date().toDateString(),
    },
    {
      id: "4",
      filename: "file4",
      contentType: "text/markdown",
      status: "ready",
      uploadedAt: new Date().toDateString(),
    },
    {
      id: "5",
      filename: "file5",
      contentType: "application/pdf",
      status: "ready",
      uploadedAt: new Date().toDateString(),
    },
  ];

describe("MainSideBar", () => {
  it("renders without crashing", () => {
    const modalRef = { current: null };
    const { container } = render(
      <MainSideBar modalRef={modalRef} documentsInfo={mockDocumentsInfo} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the correct number of documents", () => {
    const modalRef = { current: null };
    const { getAllByRole } = render(
      <MainSideBar modalRef={modalRef} documentsInfo={mockDocumentsInfo} />,
    );
    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(mockDocumentsInfo.length);
  });

  it("renders the 'Upload File' button", () => {
    const modalRef = { current: null };
    const { getByText } = render(
      <MainSideBar modalRef={modalRef} documentsInfo={mockDocumentsInfo} />,
    );
    const uploadButton = getByText("Upload File");
    expect(uploadButton).toBeInTheDocument();
  });

  it("opens the upload modal when 'Upload File' button is clicked", () => {
    const modal = document.createElement("dialog");
    modal.showModal = vi.fn();
    const modalRef = { current: modal };
    const { getByText } = render(
      <MainSideBar modalRef={modalRef} documentsInfo={mockDocumentsInfo} />,
    );
    const uploadButton = getByText("Upload File");
    uploadButton.click();
    expect(modalRef.current?.showModal).toHaveBeenCalled();
  });
});
