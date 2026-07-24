import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MainPage } from './mainPage';
import { getDocuments } from '../api/documents';
import type { Document } from '@rag_app/shared';
import userEvent from '@testing-library/user-event';

vi.mock('../api/documents', () => ({
  getDocuments: vi.fn(),
}));

vi.mock('../components/chatBox', () => ({
  ChatBox: () => <div data-testid="chat-box" />,
}));

vi.mock('../components/uploadModal', () => ({
  UploadModal: ({ ref, setDocumentsInfo }: any) => (
    <dialog ref={ref} data-testid="upload-modal">
      <button onClick={() => setDocumentsInfo([
        {
          id: "3",
          filename: "test3",
          contentType: "text/plain",
          uploadedAt: (new Date()).toDateString(),
          status: "processing"
        }
      ])}>
        Simulate upload
      </button>
    </dialog>
  ),
}));

vi.mock('../components/mainSideBar', () => ({
  MainSideBar: ({ documentsInfo }: any) => (
    <div data-testid="sidebar">
      {documentsInfo.map((doc: Document) => (
        <span key={doc.id}>{doc.filename}</span>
      ))}
    </div>
  ),
}));

const mockDocuments: Document[] = [
  {
    id: "1",
    filename: "test1",
    contentType: "text/markdown",
    uploadedAt: (new Date()).toDateString(),
    status: "ready"
  },
  {
    id: "2",
    filename: "test2",
    contentType: "text/plain",
    uploadedAt: (new Date()).toDateString(),
    status: "ready"
  },
];

describe("MainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crasing", () => {
    vi.mocked(getDocuments).mockResolvedValueOnce([]);

    const { container } = render(<MainPage />);

    expect(container.querySelectorAll(".main-page")).toHaveLength(1);
  })

  it("renders all components", () => {
    vi.mocked(getDocuments).mockResolvedValueOnce([]);

    render(<MainPage />);

    expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('chat-box')).toBeInTheDocument();
  });
  
  it("calls getDocuments when mounted", async () => {
    vi.mocked(getDocuments).mockResolvedValueOnce([]);

    render(<MainPage />);

    await waitFor(() => {
      expect(getDocuments).toHaveBeenCalledTimes(1);
    });
  });

  it("sends the retrieved documents to MainSideBar", async () => {
    vi.mocked(getDocuments).mockResolvedValue(mockDocuments);
    
    render(<MainPage />);

    expect(await screen.findByText('test1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
  });

  it("mantains the sidebar empty while waiting for fetch", () => {
    vi.mocked(getDocuments).mockImplementation(() => new Promise(() => {}));

    render(<MainPage />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeEmptyDOMElement();
  });

  it("updates documentsInfo when setDocumentsInfo is called from UploadModal", async () => {
    vi.mocked(getDocuments).mockResolvedValueOnce([]);
    const user = userEvent.setup();
    render(<MainPage />);

    await user.click(screen.getByText('Simulate upload'));

    expect(await screen.findByText('test3')).toBeInTheDocument();
  });
})
