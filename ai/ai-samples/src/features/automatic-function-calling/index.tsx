import { useState } from 'react';
import { executeAutomaticFunctionCalling } from './service';

export default function AutomaticFunctionCallingView() {
  const [prompt, setPrompt] = useState('What is the weather in San Francisco, CA on 2024-10-17?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    const cleanedPrompt = prompt.trim();
    if (!cleanedPrompt) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const finalText = await executeAutomaticFunctionCalling(cleanedPrompt);
      setResult(finalText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Automatic Function Calling</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Demonstrates Automatic Function Calling: The SDK natively intercepts the model's tool request, 
        executes your local code, and returns the final synthesized response—all from a single <code>chat.sendMessage()</code> call.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      
      <button 
        onClick={handleRun} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Running...' : 'Ask Gemini'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fee', color: '#c00' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eefcf5', border: '1px solid #c3e6cb' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Final Answer</h4>
          <p style={{ margin: 0 }}>{result}</p>
        </div>
      )}
    </div>
  );
}