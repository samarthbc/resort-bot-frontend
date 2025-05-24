import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Maximize2, Minimize2, X, Send, Plus } from "lucide-react";
import axios from "axios";


const initialMessages = [
  { role: "bot", content: "Welcome ! How can I help you today?" }
];

export default function ChatBot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState("corner");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (position !== "hidden" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [position]);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");
    
    // const res = await axios.post("http://localhost:8000/chat", { message: input });
    const res = await axios.post("https://resort-bot-backend.onrender.com/chat", { message: input });
    const botMsg = { role: "bot", content: res.data.reply };
    setMessages([...messages, userMsg, botMsg]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (position === "hidden") {
    return (
      <button 
        onClick={() => setPosition("corner")}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
      >
        <MessageSquare />
      </button>
    );
  }

  return (
    <div className={`bg-gray-900 text-gray-100 flex flex-col rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
      position === "maximized" 
        ? "fixed inset-0 z-50" 
        : "fixed bottom-6 right-6 w-80 h-96 z-50"
    }`}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <h2 className="font-medium">Resort Assistant</h2>
        </div>
        <div className="flex space-x-2">
          {position === "maximized" ? (
            <button 
              onClick={() => setPosition("corner")} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          ) : (
            <button 
              onClick={() => setPosition("maximized")} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 size={18} />
            </button>
          )}
          <button 
            onClick={() => setPosition("hidden")} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-3/4 px-4 py-2 rounded-lg ${
                msg.role === "user" 
                  ? "bg-indigo-600 text-white rounded-br-none" 
                  : "bg-gray-800 text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
          <button 
            className="text-gray-400 hover:text-white mr-2"
            aria-label="Add attachment"
          >
            <Plus size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-400"
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`ml-2 text-gray-400 ${input.trim() ? "hover:text-white" : ""}`}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}