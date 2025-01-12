// components/ChatInterface.jsx
'use client';
import React, { useState } from 'react';

const ChatInterface = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.message);
      } else {
        console.error('Error from API:', data.error);
      }
    } catch (error) {
      console.error('Failed to send prompt:', error);
    }
  };

  return (
    <div>
      <input type="text" value={prompt} onChange={handleInputChange} placeholder="Enter your prompt" />
      <button onClick={handleSubmit}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
};

export default ChatInterface;
