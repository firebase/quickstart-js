import React from "react";
import { Content } from "firebase/ai";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: Content;
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

/**
 * Renders a single chat message bubble, styled based on the message role ('user' or 'model').
 * It only renders messages that should be visible in the log (user messages, or model messages
 * containing text). Function role messages or model messages consisting only of function calls
 * are typically not rendered directly as chat bubbles.
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
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
  const shouldRender = isUser || (isModel && text.trim() !== "");

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`${styles.messageContainer} ${isUser ? styles.user : styles.model}`}
    >
      <div className={styles.messageBubble}>
        {/* Use <pre> to preserve whitespace and newlines within the text content.
                     Handles potential multi-line responses correctly. */}
        <pre className={styles.messageText}>{text}</pre>
      </div>
    </div>
  );
};

export default ChatMessage;
