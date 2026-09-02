import React, { useState, useRef, useEffect } from 'react';
import { analyzeVideo, streamVideoAnalysis } from './service';

const SAMPLE_PROMPTS = [
  'Describe what is happening in this video in detail.'
];

export default function VideoAnalysisView() {
  const [prompt, setPrompt] = useState<string>(SAMPLE_PROMPTS[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState<boolean>(true);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
  };

  const handleAnalyze = async () => {
    const cleanedPrompt = prompt.trim();
    if (!selectedFile || !cleanedPrompt) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      if (useStreaming) {
        await streamVideoAnalysis(cleanedPrompt, selectedFile, (chunk) => {
          setResponse((prev) => prev + chunk);
        });
      } else {
        const resultText = await analyzeVideo(cleanedPrompt, selectedFile);
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

  const handleClear = () => {
    setSelectedFile(null);
    setResponse('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Video Analysis & Understanding</h2>
        {(selectedFile || response) && (
          <button
            onClick={handleClear}
            disabled={loading}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f1f3f4',
              color: '#3c4043',
              border: '1px solid #dadce0',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <p style={{ color: '#5f6368', marginBottom: '20px' }}>
        Upload a video file alongside a prompt to analyze video frames, extract timestamps, describe actions, or transcribe content using Gemini.
      </p>

      {/* Video Upload Section */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Select Video File:
        </label>
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*,video/mp4,video/webm,video/quicktime,video/x-matroska"
          onChange={handleFileChange}
          disabled={loading}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        <small style={{ display: 'block', color: '#80868b', marginTop: '4px' }}>
          Supported formats: MP4, WebM, MOV, etc. (Inline payloads recommended under 20MB).
        </small>
      </div>

      {/* Video Preview */}
      {previewUrl && (
        <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #dadce0', backgroundColor: '#000' }}>
          <video
            src={previewUrl}
            controls
            style={{ width: '100%', maxHeight: '320px', display: 'block' }}
          />
          {selectedFile && (
            <div style={{ padding: '8px 12px', backgroundColor: '#f8f9fa', fontSize: '0.85rem', color: '#5f6368', borderTop: '1px solid #dadce0' }}>
              <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>
      )}

      {/* Prompt Suggestions */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#5f6368', fontWeight: 600 }}>
          Suggested Prompts:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(sample)}
              disabled={loading}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                backgroundColor: prompt === sample ? '#e8f0fe' : '#f8f9fa',
                color: prompt === sample ? '#1a73e8' : '#3c4043',
                border: `1px solid ${prompt === sample ? '#aecbfa' : '#dadce0'}`,
                borderRadius: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {sample.length > 40 ? `${sample.slice(0, 40)}...` : sample}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Prompt:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question about the video or describe what you'd like analyzed..."
          rows={3}
          disabled={loading}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', fontFamily: 'inherit', borderRadius: '4px', border: '1px solid #dadce0' }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
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
          disabled={loading || !selectedFile || !prompt.trim()}
          style={{
            padding: '10px 24px',
            backgroundColor: loading || !selectedFile || !prompt.trim() ? '#ccc' : '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !selectedFile || !prompt.trim() ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          {loading ? 'Analyzing Video...' : 'Analyze Video'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ color: '#c5221f', backgroundColor: '#fce8e6', border: '1px solid #fad2cf', padding: '12px', marginTop: '16px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#202124' }}>Analysis Result:</h3>
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            color: '#202124',
          }}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
}

