import React from "react";
import {
  Content,
  GroundingChunk,
  GroundingMetadata,
  GroundingSupport,
} from "firebase/ai";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  /** The message content object containing role and parts. */
  message: Content;
  groundingMetadata?: GroundingMetadata | null;
}

interface ProcessedSegment {
  startIndex: number;
  endIndex: number;
  chunkIndices: number[]; // 1-based for display
  originalSupportIndex: number; // To link back if needed
}

/**
 * Extracts and concatenates text from all 'text' parts within a Content message.
 * Ignores other part types like images or function calls for text extraction.
 * @param message The Content object.
 * @returns The combined text string, or an empty string if no text parts are found.
 */
const getMessageText = (message: Content): string => {
  if (!message.parts || message.parts.length === 0) {
    return "";
  }
  // Filter for parts that are TextPart (have a 'text' property) and join them.
  return message.parts
    .filter((part): part is { text: string } => typeof part.text === "string")
    .map((part) => part.text)
    .join("");
};

const renderTextWithInlineHighlighting = (
  text: string,
  supports: GroundingSupport[],
  chunks: GroundingChunk[],
): React.ReactNode[] => {
  if (!supports || supports.length === 0 || !text) {
    return [text];
  }

  const segmentsToHighlight: ProcessedSegment[] = [];

  supports.forEach((support, supportIndex) => {
    if (support.segment && support.groundingChunkIndices) {
      const segment = support.segment;
      if (segment.partIndex === undefined || segment.partIndex === 0) {
        segmentsToHighlight.push({
          startIndex: segment.startIndex,
          endIndex: segment.endIndex, // API's endIndex is typically exclusive
          chunkIndices: support.groundingChunkIndices.map((ci) => ci + 1), // 1-based
          originalSupportIndex: supportIndex,
        });
      }
    }
  });

  if (segmentsToHighlight.length === 0) {
    return [text];
  }

  // Sort segments by start index, then by end index
  segmentsToHighlight.sort((a, b) => {
    if (a.startIndex !== b.startIndex) {
      return a.startIndex - b.startIndex;
    }
    return b.endIndex - a.endIndex; // Longer segments first
  });

  const outputNodes: React.ReactNode[] = [];
  let lastIndexProcessed = 0;

  segmentsToHighlight.forEach((seg, i) => {
    // Add un-highlighted text before this segment
    if (seg.startIndex > lastIndexProcessed) {
      outputNodes.push(text.substring(lastIndexProcessed, seg.startIndex));
    }

    // Add the highlighted segment
    // Ensure we don't re-highlight an already covered portion if a shorter segment comes later
    const currentSegmentText = text.substring(seg.startIndex, seg.endIndex);
    const tooltipText = seg.chunkIndices
      .map((ci) => {
        const chunk = chunks[ci - 1]; // ci is 1-based
        return chunk.web?.title || chunk.web?.uri || `Source ${ci}`;
      })
      .join("; ");

    outputNodes.push(
      <span
        key={`seg-${i}`}
        className={styles.highlightedSegment}
        title={`Sources: ${tooltipText}`}
        data-source-indices={seg.chunkIndices.join(",")}
      >
        {currentSegmentText}
        <sup className={styles.sourceSuperscript}>
          [{seg.chunkIndices.join(",")}]
        </sup>
      </span>,
    );
    lastIndexProcessed = Math.max(lastIndexProcessed, seg.endIndex);
  });

  // Add any remaining un-highlighted text
  if (lastIndexProcessed < text.length) {
    outputNodes.push(text.substring(lastIndexProcessed));
  }

  return outputNodes;
};

/**
 * Renders a single chat message bubble, styled based on the message role ('user' or 'model').
 * It only renders messages that should be visible in the log (user messages, or model messages
 * containing text). Function role messages or model messages consisting only of function calls
 * are typically not rendered directly as chat bubbles.
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  groundingMetadata,
}) => {
  const text = getMessageText(message);
  const isUser = message.role === "user";
  const isModel = message.role === "model";

  // We render:
  // 1. User messages (even if they only contain images/files, the 'user' role indicates an entry).
  // 2. Model messages *only if* they contain actual text content.
  // We *don't* render:
  // 1. 'function' role messages (these represent execution results, not direct chat).
  // 2. 'model' role messages that *only* contain function calls (these are instructions, not display text).
  // 3. 'system' role messages (handled separately, not usually in chat history display).
  const shouldRender =
    isUser ||
    (isModel && text.trim() !== "");

  if (!shouldRender) {
    return null;
  }

<<<<<<< HEAD
<<<<<<< HEAD
||||||| parent of 733cb1a (x)
=======
  // Determine content to render
>>>>>>> 733cb1a (x)
  let messageContentNodes: React.ReactNode[];
  if (
    isModel &&
    groundingMetadata?.groundingSupports &&
    groundingMetadata?.groundingChunks
  ) {
    messageContentNodes = renderTextWithInlineHighlighting(
      text,
      groundingMetadata.groundingSupports,
      groundingMetadata.groundingChunks,
    );
  } else {
    messageContentNodes = [text];
  }

||||||| parent of 22637ef (abort)
  // Determine content to render
  let messageContentNodes: React.ReactNode[];
  if (
    isModel &&
    groundingMetadata?.groundingSupports &&
    groundingMetadata?.groundingChunks
  ) {
    messageContentNodes = renderTextWithInlineHighlighting(
      text,
      groundingMetadata.groundingSupports,
      groundingMetadata.groundingChunks,
    );
  } else {
    messageContentNodes = [text];
  }

=======
>>>>>>> 22637ef (abort)
  return (
    <div
      className={`${styles.messageContainer} ${isUser ? styles.user : styles.model}`}
    >
      <div className={styles.messageBubble}>
        <pre className={styles.messageText}>
          {messageContentNodes.map((node, index) => (
            <React.Fragment key={index}>{node}</React.Fragment>
          ))}
        </pre>
        {/* Source list rendering for grounded results. This display must comply with the display requirements in the Service Terms. */}
        {isModel &&
          groundingMetadata &&
          (groundingMetadata.searchEntryPoint?.renderedContent ||
          (groundingMetadata.groundingChunks &&
            groundingMetadata.groundingChunks.length > 0) ? (
            <div className={styles.sourcesSection}>
              {groundingMetadata.searchEntryPoint?.renderedContent && (
                <div
                  className={styles.searchEntryPoint}
                  dangerouslySetInnerHTML={{
                    __html: groundingMetadata.searchEntryPoint.renderedContent,
                  }}
                />
              )}
              {groundingMetadata.groundingChunks &&
                groundingMetadata.groundingChunks.length > 0 && (
                  <>
                    <h5 className={styles.sourcesTitle}>Sources:</h5>
                    <ul className={styles.sourcesList}>
                      {groundingMetadata.groundingChunks.map((chunk, index) => (
                        <li
                          key={index}
                          className={styles.sourceItem}
                          id={`source-ref-${index + 1}`}
                        >
                          <a
                            href={chunk.web?.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`[${index + 1}] ${chunk.web?.title || chunk.web?.uri}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
          ) : null)}
      </div>
    </div>
  );
};

export default ChatMessage;
