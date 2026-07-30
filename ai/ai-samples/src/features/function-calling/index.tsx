import { useState } from 'react';
import { executeFunctionCalling, FunctionCallingResult } from './service';

export default function FunctionCallingView() {
  const [prompt, setPrompt] = useState('What was the weather in Boston on October 17, 2024?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FunctionCallingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await executeFunctionCalling(cleanedPrompt);
      setResult(res);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An error occurred during function calling.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Function Calling</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Demonstrates the manual round-trip: Gemini extracts structured arguments,
        your app executes a local function, and sends the result back for final text synthesis.
      </p>

      {/* Input Prompt */}
      <div style={{ marginBottom: '15px' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            fontSize: '14px',
          }}
          placeholder="Ask a question that triggers the tool..."
        />
      </div>

      <button
        onClick={handleRun}
        disabled={loading || !prompt.trim()}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#1a73e8',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Executing Round-Trip...' : 'Run Function Calling'}
      </button>

      {/* Error Output */}
      {error && (
        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fde8e8', color: '#c5221f', borderRadius: '6px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Visual Round-Trip Breakdown */}
      {result && (
        <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* Step 1 & 2: Function Call Request */}
          {result.functionCall ? (
            <div style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1a73e8' }}>
                Step 1 & 2: Model Triggered Function Call
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>
                Tool Requested: <code>{result.functionCall.name}</code>
              </p>
              <pre style={{ margin: 0, padding: '10px', backgroundColor: '#282c34', color: '#abb2bf', borderRadius: '4px', overflowX: 'auto', fontSize: '12px' }}>
                {JSON.stringify(result.functionCall.args, null, 2)}
              </pre>
            </div>
          ) : (
            <div style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff3cd' }}>
              <p style={{ margin: 0, color: '#856404' }}>
              </p>
            </div>
          )}

          {/* Step 3: Local Function Output */}
          {result.functionResult && (
            <div style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#137333' }}>
                Step 3: Local Function Execution Result
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>
                Data returned from local <code>fetchWeather</code> API:
              </p>
              <pre style={{ margin: 0, padding: '10px', backgroundColor: '#282c34', color: '#abb2bf', borderRadius: '4px', overflowX: 'auto', fontSize: '12px' }}>
                {JSON.stringify(result.functionResult, null, 2)}
              </pre>
            </div>
          )}

          {/* Step 4 & 5: Final Synthesized Text Response */}
          <div style={{ padding: '15px', border: '1px solid #ceebe1', borderRadius: '8px', backgroundColor: '#e6f4ea' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#137333' }}>
              Step 4 & 5: Final Model Response
            </h4>
            <p style={{ margin: 0, fontSize: '15px', color: '#202124', lineHeight: '1.5' }}>
              {result.finalText}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}