import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import ChatView from "../../views/ChatView";
import ImagenView from "../../views/ImagenView";
import { AppMode } from "../../App";
import {
  UsageMetadata,
  ModelParams,
  ImagenModelParams,
  BackendType,
  AI,
  VertexAIBackend,
  GoogleAIBackend,
  getAI,
} from "firebase/ai";
import {
  AVAILABLE_GENERATIVE_MODELS,
  AVAILABLE_IMAGEN_MODELS,
  defaultGenerativeParams,
  defaultImagenParams,
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
  const [imagenParams, setImagenParams] = useState<ImagenModelParams>({
    model: AVAILABLE_IMAGEN_MODELS[0],
    ...defaultImagenParams,
  });

  const [usageMetadata, setUsageMetadata] = useState<UsageMetadata | null>(
    null,
  );

  useEffect(() => {
    console.log(`Initializing AI instance for backend: ${activeBackendType}`);
    try {
      const backendInstance =
        activeBackendType === BackendType.VERTEX_AI
          ? new VertexAIBackend()
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
  }, [activeBackendType]);

  useEffect(() => {
    setUsageMetadata(null);
  }, [activeMode]);

  useEffect(() => {
    const validModes: AppMode[] = ["chat", "imagenGen"];
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
          />
        );
      case "imagenGen":
        return (
          <ImagenView aiInstance={activeAI} currentParams={imagenParams} />
        );
      default:
        console.error(`Unexpected activeMode: ${activeMode}`);
        return (
          <ChatView
            aiInstance={activeAI}
            onUsageMetadataChange={setUsageMetadata}
            currentParams={generativeParams}
            activeMode={activeMode}
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
            imagenParams={imagenParams}
            setImagenParams={setImagenParams}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
