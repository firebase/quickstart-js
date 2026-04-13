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
  const [variables, setVariables] = useState<Array<{ id: string; key: string; value: string }>>([
    { id: "1", key: "", value: "" }
  ]);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddVariable = () => {
    setVariables((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), key: "", value: "" }
    ]);
  };

  const handleRemoveVariable = (id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVariableChange = (id: string, field: "key" | "value", value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
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
      
      const templateToolConfig: TemplateToolConfig | undefined = currentParams.toolConfig?.retrievalConfig ? {
        retrievalConfig: currentParams.toolConfig.retrievalConfig
      } : undefined;

      const model = getTemplateGenerativeModel(aiInstance, {});

      // Convert array to object
      const variablesObject: Record<string, string> = {};
      variables.forEach((v) => {
        if (v.key.trim()) {
          variablesObject[v.key.trim()] = v.value;
        }
      });

      console.log("[ServerTemplateView] Calling generateContent with variables:", variablesObject);
      const result = await model.generateContent(templateId.trim(), variablesObject, undefined, templateToolConfig);
      
      setResponse(result.response.text());
      
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
          {variables.map((v) => (
            <div key={v.id} className={styles.variableInputGroup}>
              <input
                type="text"
                placeholder="Key"
                value={v.key}
                onChange={(e) => handleVariableChange(v.id, "key", e.target.value)}
                disabled={isLoading}
                className={styles.narrowInput}
              />
              <input
                type="text"
                placeholder="Value"
                value={v.value}
                onChange={(e) => handleVariableChange(v.id, "value", e.target.value)}
                disabled={isLoading}
                className={styles.wideInput}
              />
              <button onClick={() => handleRemoveVariable(v.id)} disabled={isLoading}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className={styles.variableInputGroup}>
          <button onClick={handleAddVariable} disabled={isLoading}>
            Add Row
          </button>
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
