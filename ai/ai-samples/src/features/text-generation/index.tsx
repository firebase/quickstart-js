import React from 'react';
import React, { useState } from 'react';
import { generateText } from './service';

export default function Feature() {
export default function TextGeneration() {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      // Direct call to the decoupled logic service
      const text = await generateText(prompt);
      setResponse(text);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>text-generation</h2>
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Text Generation</h2>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask the AI a question..."
        rows={5}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      
      <button onClick={handleGenerate} disabled={loading || !prompt.trim()} style={{ padding: '10px 20px' }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
      {response && <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0' }}><p style={{ whiteSpace: 'pre-wrap' }}>{response}</p></div>}
    </div>
  );
}
