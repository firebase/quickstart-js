import { useState } from 'react';
import { generateGroundedContent, GroundedResult } from './service';

export default function GroundingWithGoogleSearchView() {
  const [prompt, setPrompt] = useState('Who won the world cup 2026?');
  const [result, setResult] = useState<GroundedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateGroundedContent(cleanedPrompt);
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during grounded generation.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const sources = result?.groundingMetadata?.groundingChunks?.filter((chunk) => chunk.web) ?? [];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Grounding with Google Search</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Connects Gemini to real-time Google Search to provide up-to-date answers and sources.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Prompt:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '8px', fontFamily: 'inherit' }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: '10px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#ccc' : '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {loading ? 'Searching & Generating...' : 'Generate Grounded Content'}
      </button>

      {error && (
        <div style={{ color: '#D8000C', backgroundColor: '#FFD2D2', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <h3>Response:</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{result.text}</p>

          {sources.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4>Sources:</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {sources.map((chunk, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <a
                      href={chunk.web?.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007BFF' }}
                    >
                      {chunk.web?.title || chunk.web?.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}