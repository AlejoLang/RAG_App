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

    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

    const response = await fetch(backendUrl + "/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: inputFieldRef.current?.value || "" }),
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
      alert("Error sending message. Please try again.");
    }

    if (inputFieldRef.current) {
      inputFieldRef.current.value = "";
    }
  };

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
        <input type="text" placeholder="Type a message..." ref={inputFieldRef} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}