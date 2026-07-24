import { useRef, useState } from "react";
import { type Message } from "../../types";
import "./chatBox.css";
import { aiQuerry } from "../api/ai";

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if(inputFieldRef.current?.value == '') {
      return;
    }
    const newMessage: Message = {
      text: inputFieldRef.current?.value || "",
      sender: "user",
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    const query = inputFieldRef.current?.value || "";
    if (inputFieldRef.current) {
      inputFieldRef.current.value = "";
    }
    const response = await aiQuerry(query);
    const responseMessage: Message = {
      text: response,
      sender: "assistant",
      timestamp: Date.now()
    };
    setMessages((prevMessages) => [...prevMessages, responseMessage]);
  }

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type a message..." ref={inputFieldRef} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}