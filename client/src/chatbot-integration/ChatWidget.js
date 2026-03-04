import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./chatbot-style.css";

const ChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the StudiIn Assistant. How can I help you manage your tasks today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Hide on login/signup


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("https://taskmanagement-w3gy.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.reply || data?.error || "Server error");
      }

      if (!data.reply) {
        throw new Error("AI returned an empty response");
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "bot"
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("[CHAT ERROR]", error);

      let errorText = "Sorry, something went wrong.";

      if (error.message.includes("fetch")) {
        errorText =
          "Cannot connect to the server. Please make sure the backend is running.";
      } else {
        errorText = error.message;
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 2, text: errorText, sender: "bot" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hide on login/signup
  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>StudiIn Assistant</span>
            <button className="close-btn" onClick={toggleChat}>
              &times;
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="typing-indicator">AI is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}

      <div className="chatbot-bubble" onClick={toggleChat}>
        <svg className="chatbot-icon" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </div>
    </div>
  );
};

export default ChatWidget;
