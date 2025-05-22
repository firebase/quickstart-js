import React from "react";
import styles from "./ResponseDisplay.module.css";

// Simple component to format and display JSON data within a <pre> tag.
const JsonViewer: React.FC<{ data: object }> = ({ data }) => {
  try {
    // Pretty-print JSON with 2-space indentation
    const jsonString = JSON.stringify(data, null, 2);
    return <pre className={styles.jsonPre}>{jsonString}</pre>;
  } catch (error) {
    console.error("Error formatting JSON for display:", error);
    return (
      <pre className={styles.jsonPre}>Error: Could not display JSON data.</pre>
    );
  }
};

interface ResponseDisplayProps {
  /** The primary text output from the AI model (can be plain text or stringified JSON). */
  responseText: string;
  /** Optional parsed JSON object to display in a collapsible section. */
  responseJson?: object | null;
  /** Flag to indicate if the response is currently being generated. */
  isLoading: boolean;
  /** Optional title for the response area. */
  title?: string;
}

/**
 * Displays the AI model's response, handling loading states, text output,
 * and an optional collapsible raw JSON view.
 */
const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  responseText,
  responseJson,
  isLoading,
  title = "Result",
}) => {
  // Determine whether to show the placeholder text.
  // Show only if not loading AND there's no text or JSON data yet.
  const showPlaceholder = !isLoading && !responseText && !responseJson;

  // Determine whether to show the loading overlay.
  // Show only when actively loading AND no response text has arrived yet (allows for streaming).
  const showLoadingOverlay = isLoading && !responseText;

  return (
    <div className={styles.responseContainer}>
      <h4 className={styles.responseTitle}>{title}</h4>
      <div className={styles.responseOutput}>
        {/* Loading Overlay */}
        {showLoadingOverlay && (
          <div className={styles.loadingIndicator}>Generating...</div>
        )}

        {/* Main Response Text */}
        {/* Render the responseText if it exists, even during loading to support streaming output */}
        {responseText && (
          <pre className={styles.responseText}>{responseText}</pre>
        )}

        {/* Placeholder Text */}
        {showPlaceholder && (
          <div className={styles.placeholder}>Output will appear here.</div>
        )}
      </div>

      {/* Optional JSON Viewer */}
      {/* Show only if JSON data exists AND we are not currently loading */}
      {responseJson && !isLoading && (
        <details className={styles.jsonDetails}>
          <summary className={styles.jsonSummary}>
            View Raw Response JSON
          </summary>
          <JsonViewer data={responseJson} />
        </details>
      )}
    </div>
  );
};

export default ResponseDisplay;
