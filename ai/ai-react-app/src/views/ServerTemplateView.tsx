import React, { useState } from "react";
import { AI, getTemplateGenerativeModel, UsageMetadata, TemplateToolConfig } from "firebase/ai";
import styles from "./ServerTemplateView.module.css";

interface ServerTemplateViewProps {
  aiInstance: AI;
  onUsageMetadataChange: (metadata: UsageMetadata | null) => void;
  currentParams: any; // Using any for now to avoid direct ModelParams conflicts if needed, but should be similar
}

const ServerTemplateView: React.FC<ServerTemplateViewProps> = ({
  aiInstance,
  onUsageMetadataChange,
  currentParams,
}) => {
  const [templateId, setTemplateId] = useState("");
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddVariable = () => {
    if (newKey.trim()) {
      setVariables((prev) => ({ ...prev, [newKey.trim()]: newValue }));
      setNewKey("");
      setNewValue("");
    }
  };

  const handleRemoveVariable = (key: string) => {
    setVariables((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!templateId.trim()) {
      setError("Template ID is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);
    onUsageMetadataChange(null);

    try {
      console.log("[ServerTemplateView] Building model with getTemplateGenerativeModel");
      
      // Construct TemplateToolConfig with RetrievalConfig if enabled in currentParams
      const templateToolConfig: TemplateToolConfig | undefined = currentParams.toolConfig?.retrievalConfig ? {
        retrievalConfig: currentParams.toolConfig.retrievalConfig
      } : undefined;

      const model = getTemplateGenerativeModel(aiInstance, {});

      console.log("[ServerTemplateView] Calling generateContent with variables:", variables);
      const result = await model.generateContent(templateId.trim(), variables, undefined, templateToolConfig);
      
      setResponse(result.response.text());
      
      // If usage metadata is available, report it
      // if (result.usageMetadata) onUsageMetadataChange(result.usageMetadata);
      
    } catch (err: unknown) {
      console.error("[ServerTemplateView] Error calling generate:", err);
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatViewContainer}>
      <div className={styles.chatHistory}>
        {response && (
          <div className={styles.responseArea}>
            <h3>Response:</h3>
            <pre>{response}</pre>
          </div>
        )}
        {isLoading && (
          <div className={styles.loadingBubble}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {!response && !isLoading && !error && (
          <div className={styles.emptyChat}>
            Enter Template ID and Variables to generate content.
          </div>
        )}
      </div>

      <div className={styles.inputAreaContainer}>
        <div className={styles.variableInputGroup}>
          <label htmlFor="template-id-input">Template ID</label>
          <input
            id="template-id-input"
            type="text"
            placeholder="Template ID"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            disabled={isLoading}
            className={styles.narrowInput}
          />
        </div>

        <div className={styles.sectionLabel}>Template Variables:</div>

        <div className={styles.variableList}>
          {Object.entries(variables).map(([key, value]) => (
            <div key={key} className={styles.variableInputGroup}>
              <input type="text" value={key} readOnly className={styles.narrowInput} />
              <input type="text" value={value} readOnly className={styles.wideInput} />
              <button onClick={() => handleRemoveVariable(key)} disabled={isLoading}>Remove</button>
            </div>
          ))}
        </div>

        <div className={styles.variableInputGroup}>
          <input
            type="text"
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            disabled={isLoading}
            className={styles.narrowInput}
          />
          <input
            type="text"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            disabled={isLoading}
            className={styles.wideInput}
          />
          <button onClick={handleAddVariable} disabled={isLoading}>Add Variable</button>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          className={styles.runButton}
        >
          {isLoading ? "Generating..." : "Submit ➤"}
        </button>
      </div>
    </div>
  );
};

export default ServerTemplateView;
