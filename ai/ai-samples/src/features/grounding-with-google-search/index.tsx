import { useState, useRef, useEffect } from 'react';
import { generateGroundedContent, GroundedResult } from './service';

/**
 * Encapsulates the Google Search suggestions HTML/CSS within a Shadow DOM
 * as documented in Firebase's SearchEntrypoint reference:
 * container.attachShadow({ mode: 'open' }).innerHTML = renderedContent;
 * (https://firebase.google.com/docs/reference/js/ai.searchentrypoint)
 */
function SearchSuggestionsWidget({ renderedContent }: { renderedContent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const shadowRoot =
      containerRef.current.shadowRoot ||
      containerRef.current.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = renderedContent;
  }, [renderedContent]);

  return <div ref={containerRef} style={{ minHeight: '40px' }} />;
}

export default function GroundingWithGoogleSearchView() {
  const [prompt, setPrompt] = useState('Who won the euro 2024?');
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

  const renderedContent = result?.groundingMetadata?.searchEntryPoint?.renderedContent;

  const uniqueSources = Array.from(
    new Map(
      (result?.groundingMetadata?.groundingChunks ?? [])
        .filter((chunk): chunk is { web: { uri: string; title?: string } } => Boolean(chunk.web?.uri))
        .map((chunk) => [chunk.web.uri, chunk.web])
    ).values()
  );

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

          {/* REQUIRED COMPLIANCE: Display Google Search suggestions in Shadow DOM if returned */}
          {renderedContent && (
            <div style={{ marginTop: '15px' }}>
              <h4>Search Suggestions:</h4>
              <SearchSuggestionsWidget renderedContent={renderedContent} />
            </div>
          )}

          {/* REQUIRED COMPLIANCE: Display sources */}
          {uniqueSources.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4>Sources:</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {uniqueSources.map((source) => (
                  <li key={source.uri} style={{ marginBottom: '4px' }}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007BFF' }}
                    >
                      {source.title || source.uri}
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