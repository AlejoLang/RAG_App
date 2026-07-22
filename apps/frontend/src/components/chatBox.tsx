import { useRef, useState } from "react";
import { type Message } from "../../types";
import "./chatBox.css";

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
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
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          text: data.response,
          sender: "assistant",
          timestamp: Date.now(),
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        console.error("Error sending message:", response.statusText);
        const errorMessage: Message = {
          text: "Error sending message. Please try again.",
          sender: "assistant",
          timestamp: Date.now(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        text: "Error sending message. Please try again.",
        sender: "assistant",
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
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
        <input type="text" placeholder="Type a message..." ref={inputFieldRef} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}