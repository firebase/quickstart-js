import React, { useState, useCallback } from "react";
import styles from "./PromptInput.module.css";
import {
  AI,
  ModelParams,
  CountTokensResponse,
  Part,
  getGenerativeModel,
  ImagenModelParams,
} from "firebase/ai";
import { fileToGenerativePart } from "../../utils/fileUtils";
import { AppMode } from "../../App";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  /** isLoading refers to the main submit action loading state */
  isLoading: boolean;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  activeMode: AppMode;
  aiInstance: AI;
  currentParams?: ModelParams;
  currentImagenParams?: ImagenModelParams;
  selectedFile: File | null;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading,
  placeholder = "Type your prompt here...",
  suggestions,
  onSuggestionClick,
  activeMode,
  aiInstance,
  currentParams,
  selectedFile,
}) => {
  const [tokenCount, setTokenCount] = useState<CountTokensResponse | null>(
    null,
  );
  const [isCountingTokens, setIsCountingTokens] = useState<boolean>(false);
  const [tokenCountError, setTokenCountError] = useState<string | null>(null);

  const handleCountTokensClick = useCallback(async () => {
    // Prevent counting if main action is loading or already counting
    if (isLoading || isCountingTokens) return;

    setIsCountingTokens(true);
    setTokenCount(null);
    setTokenCountError(null);

    const currentPromptText = prompt.trim();
    const parts: Part[] = [];

    // Add text part if present
    if (currentPromptText) {
      parts.push({ text: currentPromptText });
    }

    // Add file part if present
    if (selectedFile) {
      try {
        const filePart = await fileToGenerativePart(selectedFile);
        parts.push(filePart);
      } catch (err: unknown) {
        console.error("Error processing file for token count:", err);
        setTokenCountError(`Error processing file`);
        setIsCountingTokens(false);
        return;
      }
    }

    // Don't count if there's nothing to count
    if (parts.length === 0) {
      setTokenCountError("Nothing to count tokens for (no text or file).");
      setIsCountingTokens(false);
      return;
    }

    try {
      if (!currentParams) {
        throw Error(
          "[PromptInput] currentParams is undefined when counting tokens",
        );
      }
      console.log("[PromptInput] Counting tokens with params:", currentParams);
      const model = getGenerativeModel(aiInstance, currentParams);

      const request = {
        contents: [{ role: "user" as const, parts }],
        systemInstruction: currentParams.systemInstruction,
        tools: currentParams.tools,
      };
      console.log("[PromptInput] Calling countTokens with request:", request);

      const result = await model.countTokens(request);
      setTokenCount(result);
      console.log("[PromptInput] Token count result:", result);
    } catch (err: unknown) {
      console.error("Error counting tokens:", err);
      setTokenCountError(`Token count failed`);
      setTokenCount(null); // Clear previous count on error
    } finally {
      setIsCountingTokens(false);
    }
  }, [
    prompt,
    selectedFile,
    aiInstance,
    currentParams,
    isLoading,
    isCountingTokens,
  ]);

  return (
    <div className={styles.promptContainer}>
      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && onSuggestionClick && (
        <div className={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={styles.suggestionButton}
              onClick={() => onSuggestionClick(suggestion)}
              disabled={isLoading} // Disable buttons while loading
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Area */}
      <div className={styles.inputArea}>
        <textarea
          className={styles.promptTextarea}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading || isCountingTokens} // Disable if main loading OR counting
          rows={3}
          aria-label="Prompt input"
        />
        <button
          className={styles.runButton}
          onClick={onSubmit}
          disabled={isLoading || isCountingTokens || !prompt.trim()} // Disable if loading, counting, or empty
          aria-label="Submit prompt"
        >
          {isLoading ? "Running..." : "Run ➤"}
        </button>
      </div>

      {/* Token Count Section - Only available for GenerativeModel */}
      {activeMode === "chat" && (
        <div className={styles.tokenCountSection}>
          <button
            type="button"
            onClick={handleCountTokensClick}
            disabled={
              isLoading || isCountingTokens || (!prompt.trim() && !selectedFile)
            } // Disable if no content or loading
            className={styles.countButton}
            title="Estimate token count for the current prompt and file"
          >
            {isCountingTokens ? "Counting..." : "Count Tokens"}
          </button>
          <div className={styles.tokenCountDisplay}>
            {tokenCountError && (
              <span className={styles.tokenError}>{tokenCountError}</span>
            )}
            {!tokenCountError && tokenCount && (
              <span>Total Tokens: {tokenCount.totalTokens}</span>
            )}
            {!tokenCountError && !tokenCount && !isCountingTokens && (
              <span className={styles.tokenPlaceholder}></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptInput;
