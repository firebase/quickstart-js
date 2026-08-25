import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from 'firebase/ai';
import { startNewChat, sendChatMessage } from './service';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSessionRef = useRef<ChatSession | null>(null);
  useEffect(() => {
    handleResetChat();
  }, []);

  const handleResetChat = () => {
  try {
    chatSessionRef.current = startNewChat();
    setError(null);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'Failed to initialize chat session. Please check your Firebase configuration.';
    setError(errorMessage);
  }
  setMessages([]);
  setInput('');
};

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMessage = input.trim();
    setInput(''); 
    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const responseText = await sendChatMessage(chatSessionRef.current, userMessage);
      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', color: '#1a73e8' }}>Multi-Turn Chat</h2>
          <p style={{ color: '#5f6368', margin: 0 }}>Maintains persistent history in a single session.</p>
        </div>
        <button 
          onClick={handleResetChat}
          style={{ padding: '8px 16px', backgroundColor: '#f1f3f4', color: '#3c4043', border: '1px solid #dadce0', borderRadius: '4px', cursor: 'pointer' }}
        >
          Reset Chat
        </button>
      </header>

      {/* Chat History Window */}
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #dadce0', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '16px',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#80868b', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
            No messages yet. Say hello!
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#d2e3fc' : '#ffffff',
            border: '1px solid',
            borderColor: msg.role === 'user' ? '#aecbfa' : '#dadce0',
            padding: '12px 16px',
            borderRadius: '16px',
            maxWidth: '80%'
          }}>
            <strong style={{ display: 'block', fontSize: '0.8rem', color: '#5f6368', marginBottom: '4px' }}>
              {msg.role === 'user' ? 'You' : 'Gemini'}
            </strong>
            <div style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</div>
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: '#80868b', fontStyle: 'italic' }}>Gemini is typing...</div>}
      </div>

      {error && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fce8e6', color: '#c5221f', borderRadius: '8px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #dadce0',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '0 24px',
            backgroundColor: loading || !input.trim() ? '#ccc' : '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}