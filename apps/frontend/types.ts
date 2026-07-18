export type Message = {
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
};