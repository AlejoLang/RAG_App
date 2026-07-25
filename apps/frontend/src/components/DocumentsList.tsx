import type { Document } from "@rag_app/shared";
import { typeToCompact } from "../utils/typeToCompact";
import "./DocumentsList.css";

// Component that shows a list of documents.
// The list displays, for each document:
//    - Name
//    - File type
//    - Status
export const DocumentsList = ({
  documentsInfo,
}: {
  documentsInfo: Document[];
}) => {
  return (
    <ul className="uploaded-files-list">
      {documentsInfo?.map((file: Document, index: number) => (
        <li key={index} className="file-info">
          <div className="file-title">{file.filename}</div>
          {file.status === "processing" ? (
            <div className="file-status processing">Processing</div>
          ) : file.status === "ready" ? (
            <div className="file-status ready">
              {typeToCompact(file.contentType)}
            </div>
          ) : (
            <div className="file-status failed">Failed</div>
          )}
        </li>
      ))}
    </ul>
  );
};
