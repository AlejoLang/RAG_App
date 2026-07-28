import { describe, it, expect, vi, beforeAll } from "vitest";
import { UploadModal } from "./uploadModal";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { uploadDocument } from "../api/documents";

vi.mock("../api/documents", () => ({
  uploadDocument: vi.fn().mockResolvedValue({
    id: "123",
    filename: "test.txt",
    contentType: "text/plain",
    uploadedAt: "2024-01-01",
    status: "completed",
  }),
}));

const setDocumentsInfo = vi.fn();
const trackDocument = vi.fn();

beforeAll(() => {
  HTMLDialogElement.prototype.close = vi.fn();
});

describe("UploadModal", () => {
  it("renders without crashing", () => {
    const { container } = render(<UploadModal setDocumentsInfo={setDocumentsInfo} trackDocument={trackDocument}/>);
    expect(container).toBeInTheDocument();
  });

  it("renders the file input and upload button", () => {
    const { getByText, getByLabelText } = render(<UploadModal setDocumentsInfo={setDocumentsInfo} trackDocument={trackDocument}/>);
    const textInput = getByLabelText("Select a file to upload (txt or md):");
    const button = getByText("Upload");
    expect(textInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("uploads a file and updates documents", async () => {
    vi.clearAllMocks();
    const { getByText } = render(<UploadModal setDocumentsInfo={setDocumentsInfo} trackDocument={trackDocument}/>);

    const input = screen.getByLabelText(/select a file/i);
    const button = getByText("Upload");

    const file = new File(["hello world"], "test.txt", {
      type: "text/plain",
    });

    await userEvent.upload(input, file);
    await userEvent.click(button);

    const uploadDocumentMock = vi.mocked(uploadDocument);

    await waitFor(() => {
      expect(uploadDocumentMock).toHaveBeenCalledWith(file);
    });

    await waitFor(() => {
      expect(setDocumentsInfo).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(trackDocument).toHaveBeenCalledTimes(1);
    });
  });
})