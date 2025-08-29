import React, { useState, useEffect, useCallback } from "react";
import styles from "./LiveView.module.css";
import {
  AI,
  getLiveGenerativeModel,
  startAudioConversation,
  AudioConversationController,
  AIError,
  ResponseModality,
} from "firebase/ai";
import { LIVE_MODELS } from "../services/firebaseAIService";

interface LiveViewProps {
  aiInstance: AI;
}

type ConversationState = "idle" | "active" | "error";

const LiveView: React.FC<LiveViewProps> = ({ aiInstance }) => {
  const [conversationState, setConversationState] =
    useState<ConversationState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [controller, setController] =
    useState<AudioConversationController | null>(null);

  const handleStartConversation = useCallback(async () => {
    setError(null);
    setConversationState("active");

    try {
      const modelName = LIVE_MODELS.get(aiInstance.backend.backendType)!;
      console.log(`[LiveView] Getting live model: ${modelName}`);
      const model = getLiveGenerativeModel(aiInstance, {
        model: modelName,
        generationConfig: {
          responseModalities: [ResponseModality.AUDIO]
        }
      });

      console.log("[LiveView] Connecting to live session...");
      const liveSession = await model.connect();

      console.log(
        "[LiveView] Starting audio conversation. This will request microphone permissions.",
      );

      const newController = await startAudioConversation(liveSession);

      setController(newController);
      console.log("[LiveView] Audio conversation started successfully.");
    } catch (err: unknown) {
      console.error("[LiveView] Failed to start conversation:", err);
      let errorMessage = "An unknown error occurred.";
      if (err instanceof AIError) {
        errorMessage = `Error (${err.code}): ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setConversationState("error");
      setController(null); // Ensure controller is cleared on error
    }
  }, [aiInstance]);

  const handleStopConversation = useCallback(async () => {
    if (!controller) return;

    console.log("[LiveView] Stopping audio conversation...");
    await controller.stop();
    setController(null);
    setConversationState("idle");
    console.log("[LiveView] Audio conversation stopped.");
  }, [controller]);

  // Cleanup effect to stop the conversation if the component unmounts
  useEffect(() => {
    return () => {
      if (controller) {
        console.log(
          "[LiveView] Component unmounting, stopping active conversation.",
        );
        controller.stop();
      }
    };
  }, [controller]);

  const getStatusText = () => {
    switch (conversationState) {
      case "idle":
        return "Ready";
      case "active":
        return "In Conversation";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={styles.liveViewContainer}>
      <h2 className={styles.title}>Live Conversation</h2>
      <p className={styles.instructions}>
        Click the button below to start a real-time voice conversation with the
        model. Your browser will ask for microphone permissions.
      </p>

      <div className={styles.statusContainer}>
        <div
          className={`${styles.statusIndicator} ${
            conversationState === "active" ? styles.active : ""
          }`}
        />
        <span className={styles.statusText}>Status: {getStatusText()}</span>
      </div>

      <button
        className={`${styles.controlButton} ${
          conversationState === "active" ? styles.stop : ""
        }`}
        onClick={
          conversationState === "active"
            ? handleStopConversation
            : handleStartConversation
        }
        disabled={false} // The button is never truly disabled, it just toggles state
      >
        {conversationState === "active"
          ? "Stop Conversation"
          : "Start Conversation"}
      </button>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default LiveView;
