import { useState, useRef } from 'react';
import { generateMultimodalContent } from './service';

export default function MultimodalView() {
  const [prompt, setPrompt] = useState('Describe these files in detail.');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    const fileArray = Array.from(fileInputRef.current?.files ?? []);

    if (fileArray.length === 0) {
      setError('Please select at least one file (Image or PDF).');
      return;
    }

    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const resultText = await generateMultimodalContent(cleanedPrompt, fileArray);
      setResponse(resultText);
    } catch (err: any) {
      setError(err.message || 'An error occurred during multimodal generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Multimodal Generation</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Upload images or PDFs alongside a text prompt to generate content.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Upload Files:
        </label>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          accept="image/*,application/pdf"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

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
          borderRadius: '4px'
        }}
      >
        {loading ? 'Analyzing Files...' : 'Generate Content'}
      </button>

      {error && (
        <div style={{ color: '#D8000C', backgroundColor: '#FFD2D2', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <h3>Response:</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{response}</p>
        </div>
      )}
    </div>
  );
}