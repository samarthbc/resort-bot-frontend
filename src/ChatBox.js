import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const res = await axios.post("http://localhost:8000/chat", { message: input });
    const botMsg = { role: "bot", content: res.data.reply };
    setMessages([...messages, userMsg, botMsg]);
  };

  return (
    <div>
      <h2>Resort Assistant</h2>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid gray" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
