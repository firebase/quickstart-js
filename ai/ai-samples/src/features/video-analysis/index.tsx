import { useState, useRef } from 'react';
import { analyzeVideo, streamVideoAnalysis } from './service';

export default function VideoAnalysisView() {
  const [prompt, setPrompt] = useState('Describe what is happening in this video in detail.');
  const [useStreaming, setUseStreaming] = useState(true);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    const fileArray = Array.from(fileInputRef.current?.files ?? []);

    if (fileArray.length === 0) {
      setError('Please select a video file.');
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
      if (useStreaming) {
        await streamVideoAnalysis(cleanedPrompt, fileArray[0], (chunk) => {
          setResponse((prev) => prev + chunk);
        });
      } else {
        const resultText = await analyzeVideo(cleanedPrompt, fileArray[0]);
        setResponse(resultText);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during video analysis.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Video Analysis</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Upload a video file alongside a text prompt to analyze its content.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Upload Video:
        </label>
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
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
          onClick={handleAnalyze}
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
          {loading ? 'Analyzing Video...' : 'Analyze Video'}
        </button>
      </div>

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
