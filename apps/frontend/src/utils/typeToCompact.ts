export function typeToCompact(type: string): string {
  switch (type) {
    case "application/pdf":
      return "PDF";
    case "text/plain":
      return "TXT";
    case "text/markdown":
      return "MD";
    default:
      return type;
  }
}