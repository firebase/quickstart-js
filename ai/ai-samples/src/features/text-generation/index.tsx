import { useState } from 'react';
import { 
  generateText, 
  streamText, 
  generateWithSystemInstruction 
} from './service';

export default function TextGeneration() {
  const [prompt, setPrompt] = useState<string>('');
  const cleanPrompt = prompt.trim();
  const [systemInstruction, setSystemInstruction] = useState<string>('');
  const [useStreaming, setUseStreaming] = useState<boolean>(true);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
   if (!cleanPrompt) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
     if (useStreaming) {
        await streamText(cleanPrompt, (chunk) => {
          setResponse((prev) => prev + chunk);
        });
      } else if (systemInstruction.trim()) {
        const text = await generateWithSystemInstruction(systemInstruction, prompt);
        setResponse(text);
      } else {
        const text = await generateText(prompt);
        setResponse(text);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Text Generation</h2>
      
      {/* System Instruction Input */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: '#5f6368' }}>
          System Instruction (Persona/Rules)
        </label>
        <input
          type="text"
          value={systemInstruction}
          onChange={(e) => setSystemInstruction(e.target.value)}
          placeholder="e.g., You are a helpful assistant..."
          disabled={loading || useStreaming} 
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Main Prompt Input */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: '#5f6368' }}>
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the AI a question..."
          rows={5}
          disabled={loading}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
      </div>
      
      {/* Controls: Checkbox and Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={useStreaming}
            onChange={(e) => setUseStreaming(e.target.checked)}
            disabled={loading}
          />
          Stream response
        </label>

        <button 
          onClick={handleGenerate} 
          disabled={loading || !cleanPrompt} 
          style={{ padding: '10px 20px', cursor: (loading || !cleanPrompt) ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: '#c5221f', marginTop: '15px' }}>{error}</p>}
      
      {/* Response Box */}
      {response && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{response}</p>
        </div>
      )}
    </div>
  );
}