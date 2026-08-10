import { useState, useEffect } from 'react';
import { generateWithSDKSchema, generateWithEnumValues } from './service';

export default function StructuredOutputView() {
  const [activeTab, setActiveTab] = useState<'json' | 'enum'>('json');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (activeTab === 'json') {
      setPrompt('Generate 3 animal-based characters for a card game.');
    } else {
      setPrompt('The film aims to educate and inform viewers about real-life subjects, events, or people. It offers a factual record of a particular topic by combining interviews, historical footage, and narration.');
    }
    setResult('');
    setError(null);
  }, [activeTab]);

 const handleGenerate = async () => {
        const cleanedPrompt = prompt.trim();
        if (!cleanedPrompt) return;

        setLoading(true);
        setError(null);
        setResult('');

        try {
            let output = '';
            if (activeTab === 'json') {
                output = await generateWithSDKSchema(cleanedPrompt);
            } else {
                output = await generateWithEnumValues(cleanedPrompt);
            }
            setResult(output);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred while generating structured output.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Structured Output Generation</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Force Gemini to return strictly formatted data by passing a schema into the generation configuration.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('json')}
          style={{
            padding: '10px 20px',
            fontWeight: activeTab === 'json' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'json' ? '#e0e0e0' : '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          SDK JSON Schema
        </button>
        <button
          onClick={() => setActiveTab('enum')}
          style={{
            padding: '10px 20px',
            fontWeight: activeTab === 'enum' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'enum' ? '#e0e0e0' : '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          SDK Enum Schema
        </button>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Generating...' : 'Generate Structured Output'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <pre style={{
            backgroundColor: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <code>{result}</code>
          </pre>
        </div>
      )}
    </div>
  );
}