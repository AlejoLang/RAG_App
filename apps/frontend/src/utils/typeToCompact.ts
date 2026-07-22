export function typeToCompact(type: string): string {
  switch (type) {
    case "application/pdf":
      return "PDF";
    case "text/plain":
    case "text/plain;charset=utf-8":
      return "TXT";
    case "text/markdown":
    case "text/markdown;charset=utf-8":
    case "text/x-markdown":
      return "MD";
    default:
      return "UNK";
  }
}