import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import ChatView from "../../views/ChatView";
import NanoBananaView from "../../views/NanoBananaView";
import LiveView from "../../views/LiveView";
import { AppMode } from "../../App";
import {
  UsageMetadata,
  ModelParams,
  BackendType,
  AI,
  VertexAIBackend,
  GoogleAIBackend,
  getAI,
  ResponseModality,
  InferenceMode,
} from "firebase/ai";
import {
  AVAILABLE_GENERATIVE_MODELS,
  AVAILABLE_NANO_BANANA_MODELS,
  defaultGenerativeParams,
} from "../../services/firebaseAIService";
import styles from "./MainLayout.module.css";
import { getApp } from "firebase/app";

interface MainLayoutProps {
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;
}

/**
 * Main layout component.
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  activeMode,
  setActiveMode,
}) => {
  const [activeBackendType, setActiveBackendType] = useState<BackendType>(
    BackendType.GOOGLE_AI,
  ); // Default to Gemini Developer API
  const [activeAI, setActiveAI] = useState<AI | null>(null);

  const [generativeParams, setGenerativeParams] = useState<ModelParams>({
    model: AVAILABLE_GENERATIVE_MODELS[0],
    ...defaultGenerativeParams,
  });
  const [nanoBananaParams, setNanoBananaParams] = useState<ModelParams>({
    model: AVAILABLE_NANO_BANANA_MODELS[0],
    generationConfig: {
      responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE],
    },
  });
  const [isHybridMode, setIsHybridMode] = useState(false);
  const [inferenceMode, setInferenceMode] = useState<InferenceMode>(InferenceMode.PREFER_ON_DEVICE);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string | undefined>();

  const [usageMetadata, setUsageMetadata] = useState<UsageMetadata | null>(
    null,
  );

  useEffect(() => {
    console.log(`Initializing AI instance for backend: ${activeBackendType}`);
    try {
      const backendInstance =
        activeBackendType === BackendType.VERTEX_AI
          ? activeMode === "nanobanana"
            ? new VertexAIBackend("global")
            : new VertexAIBackend()
          : new GoogleAIBackend();
      const aiInstance = getAI(getApp(), { backend: backendInstance });
      setActiveAI(aiInstance);

      console.log(
        `AI instance for ${activeBackendType} initialized successfully.`,
      );
    } catch (error) {
      console.error(
        `Failed to initialize AI for backend ${activeBackendType}:`,
        error,
      );
      setActiveAI(null);
    }
  }, [activeBackendType, activeMode]);

  useEffect(() => {
    setUsageMetadata(null);
  }, [activeMode]);

  useEffect(() => {
    const validModes: AppMode[] = ["chat", "nanobanana", "live"];
    if (!validModes.includes(activeMode)) {
      console.warn(`Invalid activeMode "${activeMode}". Resetting to "chat".`);
      setActiveMode("chat");
    }
  }, [activeMode, setActiveMode]);

  const renderActiveView = () => {
    // Show loading/error message if AI instance isn't ready
    if (!activeAI) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Initializing AI for {activeBackendType}...
        </div>
      );
    }

    switch (activeMode) {
      case "chat":
        return (
          <ChatView
            aiInstance={activeAI}
            onUsageMetadataChange={setUsageMetadata}
            currentParams={generativeParams}
            activeMode={activeMode}
            isHybridMode={isHybridMode}
            inferenceMode={inferenceMode}
          />
        );
      case "nanobanana":
        return (
          <NanoBananaView aiInstance={activeAI} currentParams={nanoBananaParams} selectedAspectRatio={selectedAspectRatio} />
        );
      case "live":
        return (
          <LiveView aiInstance={activeAI} />
        );
      default:
        console.error(`Unexpected activeMode: ${activeMode}`);
        return (
          <ChatView
            aiInstance={activeAI}
            onUsageMetadataChange={setUsageMetadata}
            currentParams={generativeParams}
            activeMode={activeMode}
            isHybridMode={isHybridMode}
            inferenceMode={inferenceMode}
          />
        );
    }
  };

  return (
    <div className={styles.appContainer}>
      <TopBar />
      <div className={styles.mainContentArea}>
        <div className={styles.leftSidebar}>
          <LeftSidebar
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            activeBackend={activeBackendType}
            setActiveBackend={setActiveBackendType} // Pass backend state/setter
            generativeParams={generativeParams}
            setGenerativeParams={setGenerativeParams}
          />
        </div>
        <main className={styles.centerContent}>{renderActiveView()}</main>
        <div className={styles.rightSidebar}>
          {/* Pass backend type for potential conditional rendering/logic */}
          <RightSidebar
            usageMetadata={usageMetadata}
            activeMode={activeMode}
            generativeParams={generativeParams}
            setGenerativeParams={setGenerativeParams}
            nanoBananaParams={nanoBananaParams}
            setNanoBananaParams={setNanoBananaParams}
            selectedAspectRatio={selectedAspectRatio}
            setSelectedAspectRatio={setSelectedAspectRatio}
            isHybridMode={isHybridMode}
            setIsHybridMode={setIsHybridMode}
            inferenceMode={inferenceMode}
            setInferenceMode={setInferenceMode}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
