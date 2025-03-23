import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function FAQ() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-container">
      <button className="faq-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Info" : "How It Works"}
      </button>
      {isOpen && (
        <div className="faq-content">
          <p>Enter your health concern in the chat, and our AI will suggest wellness products tailored to your needs.</p>
          <p>Example: "I have trouble sleeping, what supplement should I take?"</p>
        </div>
      )}
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([
    { text: "Hi, how can I help you?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Runs when messages update

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: "user" },
        { text: "Let me check that for you.", sender: "bot" },
      ]);
      setInput('');

      try {
        const response = await axios.post('http://13.53.174.248/predict', {
          text: input,
        });

        const { category, recommended_products } = response.data;

        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: `I found some recommendations for your concern:`, sender: "bot" },
          { text: `Category: ${category}`, sender: "bot" },
          ...recommended_products.map((product) => ({
            text: product,
            sender: "bot",
          })),
        ]);
      } catch (error) {
        console.error('Error communicating with the Flask API:', error);
        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: "Sorry, something went wrong. Please try again.", sender: "bot" },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="app">
      <div className="title-container">
        <h1 className="chat-title">Health & Wellness Product Recommender</h1>
      </div>

      <FAQ /> {/* Added collapsible FAQ section */}

      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Auto-scroll target */}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your health concern"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2025 Health & Wellness, All rights reserved. Created by Abdul Rafey.</p>
      </footer>
    </div>
  );
}

export default App;
