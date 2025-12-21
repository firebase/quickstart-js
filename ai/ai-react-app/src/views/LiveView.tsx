import React, { useState, useEffect, useCallback } from "react";
import styles from "./LiveView.module.css";
import {
  AI,
  getLiveGenerativeModel,
  startAudioConversation,
  startVideoRecording,
  AudioConversationController,
  VideoRecordingController,
  LiveSession,
  AIError,
  ResponseModality,
} from "firebase/ai";
import { LIVE_MODELS } from "../services/firebaseAIService";

interface LiveViewProps {
  aiInstance: AI;
}

type SessionState = "idle" | "connecting" | "connected" | "error";
type VideoSource = "camera" | "screen";

const LiveView: React.FC<LiveViewProps> = ({ aiInstance }) => {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [audioController, setAudioController] =
    useState<AudioConversationController | null>(null);
  const [videoController, setVideoController] =
    useState<VideoRecordingController | null>(null);

  const [videoSource, setVideoSource] = useState<VideoSource>("camera");

  const isAudioRunning = audioController !== null;
  const isVideoRunning = videoController !== null;

  const handleConnect = useCallback(async () => {
    setError(null);
    setSessionState("connecting");

    try {
      const modelName = LIVE_MODELS.get(aiInstance.backend.backendType)!;
      console.log(`[LiveView] Getting live model: ${modelName}`);
      const model = getLiveGenerativeModel(aiInstance, {
        model: modelName,
        generationConfig: {
          responseModalities: [ResponseModality.AUDIO],
        },
      });

      console.log("[LiveView] Connecting to live session...");
      const session = await model.connect();
      setLiveSession(session);
      setSessionState("connected");
      console.log("[LiveView] Live session connected successfully.");
    } catch (err: unknown) {
      console.error("[LiveView] Failed to connect to live session:", err);
      let errorMessage = "An unknown error occurred.";
      if (err instanceof AIError) {
        errorMessage = `Error (${err.code}): ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setSessionState("error");
      setLiveSession(null);
    }
  }, [aiInstance]);

  const handleDisconnect = useCallback(async () => {
    console.log("[LiveView] Disconnecting live session...");
    if (audioController) {
      await audioController.stop();
      setAudioController(null);
    }
    if (videoController) {
      await videoController.stop();
      setVideoController(null);
    }
    // The liveSession does not have an explicit close() method in the public API.
    // Resources are released when the controllers are stopped.
    setLiveSession(null);
    setSessionState("idle");
    console.log("[LiveView] Live session disconnected.");
  }, [audioController, videoController]);

  const handleToggleAudio = useCallback(async () => {
    if (!liveSession) return;

    if (isAudioRunning) {
      console.log("[LiveView] Stopping audio conversation...");
      await audioController?.stop();
      setAudioController(null);
      console.log("[LiveView] Audio conversation stopped.");
    } else {
      console.log(
        "[LiveView] Starting audio conversation. This may request microphone permissions.",
      );
      try {
        const newController = await startAudioConversation(liveSession);
        setAudioController(newController);
        console.log("[LiveView] Audio conversation started successfully.");
      } catch (err: unknown) {
        console.error("[LiveView] Failed to start audio conversation:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start audio conversation.",
        );
      }
    }
  }, [liveSession, audioController, isAudioRunning]);

  const handleToggleVideo = useCallback(async () => {
    if (!liveSession) return;

    if (isVideoRunning) {
      console.log("[LiveView] Stopping video recording...");
      await videoController?.stop();
      setVideoController(null);
      console.log("[LiveView] Video recording stopped.");
    } else {
      console.log(
        `[LiveView] Starting video recording with source: ${videoSource}. This may request permissions.`,
      );
      try {
        const newController = await startVideoRecording(liveSession, {
          videoSource,
        });
        setVideoController(newController);
        console.log("[LiveView] Video recording started successfully.");
      } catch (err: unknown) {
        console.error("[LiveView] Failed to start video recording:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start video recording.",
        );
      }
    }
  }, [liveSession, videoController, isVideoRunning, videoSource]);

  // Cleanup effect to disconnect if the component unmounts
  useEffect(() => {
    return () => {
      if (liveSession && liveSession.isClosed) {
        console.log(
          "[LiveView] Component unmounting, disconnecting live session.",
        );
        handleDisconnect();
      }
    };
  }, [liveSession, handleDisconnect]);

  const getStatusText = () => {
    switch (sessionState) {
      case "idle":
        return "Idle";
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Connected";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={styles.liveViewContainer}>
      <h2 className={styles.title}>Gemini Live</h2>
      <p className={styles.instructions}>
        Connect to a live session, then start audio and/or video streams.
        Ensure you grant microphone and camera/screen permissions when prompted.
      </p>

      <div className={styles.statusContainer}>
        <div
          className={`${styles.statusIndicator} ${
            sessionState === "connected" ? styles.active : ""
          }`}
        />
        <span className={styles.statusText}>Status: {getStatusText()}</span>
      </div>

      <button
        className={`${styles.controlButton} ${
          sessionState === "connected" ? styles.stop : ""
        }`}
        onClick={
          sessionState === "connected" ? handleDisconnect : handleConnect
        }
        disabled={sessionState === "connecting"}
      >
        {sessionState === "connected"
          ? "Disconnect Session"
          : sessionState === "connecting"
            ? "Connecting..."
            : "Connect Session"}
      </button>

      {sessionState === "connected" && (
        <div className={styles.controlsContainer}>
          {/* Audio Controls */}
          <button
            className={`${styles.controlButton} ${
              isAudioRunning ? styles.stop : ""
            }`}
            onClick={handleToggleAudio}
          >
            {isAudioRunning ? "Stop Audio" : "Start Audio"}
          </button>

          {/* Video Controls */}
          <div className={styles.videoControls}>
            <select
              className={styles.videoSourceSelect}
              value={videoSource}
              onChange={(e) => setVideoSource(e.target.value as VideoSource)}
              disabled={isVideoRunning}
            >
              <option value="camera">Camera</option>
              <option value="screen">Screen</option>
            </select>
            <button
              className={`${styles.controlButton} ${
                isVideoRunning ? styles.stop : ""
              }`}
              onClick={handleToggleVideo}
            >
              {isVideoRunning ? "Stop Video" : "Start Video"}
            </button>
          </div>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default LiveView;
