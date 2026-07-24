import { describe, it, expect } from "vitest";
import { DocumentsList } from "./DocumentsList";
import type { Document } from "@rag_app/shared";
import { render, screen } from "@testing-library/react";

const mockDocuments: Document[] = [
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

describe("DocumentsList", () => {
  it("renders the correct number of documents", () => {
    render(<DocumentsList documentsInfo={mockDocuments} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockDocuments.length);
  });

  it("displays the correct filename and status for each document", () => {
    render(<DocumentsList documentsInfo={mockDocuments} />);
    mockDocuments.forEach((doc) => {
      expect(screen.getByText(doc.filename)).toBeInTheDocument();
      if (doc.status === "processing") {
        expect(screen.getByText("Processing")).toBeInTheDocument();
      } else if (doc.status === "ready") {
        const expectedType =
          doc.contentType === "text/plain"
            ? "TXT"
            : doc.contentType === "text/markdown"
              ? "MD"
              : "PDF";
        expect(screen.getByText(expectedType)).toBeInTheDocument();
      } else if (doc.status === "failed") {
        expect(screen.getByText("Failed")).toBeInTheDocument();
      }
    });
  });

  it("displays the correct compact type for ready documents", () => {
    render(<DocumentsList documentsInfo={mockDocuments} />);
    const readyDocs = mockDocuments.filter((doc) => doc.status === "ready");
    readyDocs.forEach((doc) => {
      let expectedType;
      switch (doc.contentType) {
        case "text/plain":
          expectedType = "TXT";
          break;
        case "text/markdown":
          expectedType = "MD";
          break;
        case "application/pdf":
          expectedType = "PDF";
          break;
        default:
          expectedType = "UNK";
      }
      expect(screen.getAllByText(expectedType)).not.toHaveLength(0);
    });
  });
});
