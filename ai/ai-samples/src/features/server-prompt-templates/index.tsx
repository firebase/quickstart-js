import { useState } from 'react';
import { generateFromTemplate } from './service';

export default function ServerPromptTemplatesView() {
  const [templateId, setTemplateId] = useState('invoice-generator');
  const [customerName, setCustomerName] = useState('Jane Doe');

  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Add support for dynamic custom key-value variable pairs if developer wants to test other templates

  const handleExecute = async () => {
    const trimmedId = templateId.trim();
    if (!trimmedId) {
      setError('Please enter a Template ID.');
      return;
    }

    const trimmedCustomerName = customerName.trim();
    if (!trimmedCustomerName) {
      setError('Please enter a Customer Name.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse('');

    const templateVariables = {
      customerName: trimmedCustomerName,
    };

    try {
      const text = await generateFromTemplate(trimmedId, templateVariables);
      setResponse(text);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An error occurred while executing the template.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isNotFoundError =
    error && (error.toLowerCase().includes('not found') || error.toLowerCase().includes('not_found'));

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Server Prompt Templates</h2>
      <p style={{ color: '#666', marginBottom: '15px' }}>
        Centrally manage, test, and update AI prompts in the Firebase Console without redeploying client code.
      </p>

      {/* Prerequisite Setup Notice */}
      <div
        style={{
          backgroundColor: '#e8f0fe',
          border: '1px solid #c2e7ff',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#174ea6',
        }}
      >
        <strong>Console Prerequisite:</strong> Requires a published/locked template in the Firebase Console.
        See <code>README.md</code> in this feature folder for the setup guide.
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Template ID:
        </label>
        <input
          type="text"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          placeholder="invoice-generator"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Customer Name (<code>{'{{customerName}}'}</code>):
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={handleExecute}
        disabled={loading}
        style={{
          padding: '10px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#ccc' : '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '15px',
        }}
      >
        {loading ? 'Executing Template...' : 'Execute Template'}
      </button>

      {error && (
        <div
          style={{
            color: '#D8000C',
            backgroundColor: '#FFD2D2',
            padding: '12px',
            marginTop: '15px',
            borderRadius: '4px',
            fontSize: '14px',
            lineHeight: '1.4',
          }}
        >
          <strong>Error:</strong> {error}
          {isNotFoundError && (
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #ffbaba' }}>
              <strong>Setup Checklist:</strong>
              <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                <li>Template <code>{templateId}</code> exists in your Firebase project?</li>
                <li>Template status is <strong>Locked / Published</strong> (drafts cannot be called by client SDKs)?</li>
                <li>Your web app configuration matches the Firebase project where the template is stored?</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <h3>Response:</h3>
          {/* TODO: maybe add copy-to-clipboard/formatted markdown renderer */}
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{response}</p>
        </div>
      )}
    </div>
  );
}
