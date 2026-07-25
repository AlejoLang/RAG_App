import { useRef, useState } from "react";
import { type Message } from "../../types";
import "./chatBox.css";
import { aiQuerry } from "../api/ai";

// Component that handles the display of the messages between the user and the ai. 
// It also handles the user's interaction with the ai with a text input element
export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if(inputFieldRef.current?.value == '') { // Handles the case of empty input
      return;
    }
    const newMessage: Message = { // Creates the user message to use on the messages variable
      text: inputFieldRef.current?.value || "",
      sender: "user",
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const query = inputFieldRef.current?.value || "";
    if (inputFieldRef.current) { // Cleans the input element
      inputFieldRef.current.value = "";
    }
    // Performs the ai querry and adds the response on the messages array
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