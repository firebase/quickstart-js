import React from "react";
import { AppMode } from "../../App";
import styles from "./RightSidebar.module.css";
import {
  AVAILABLE_GENERATIVE_MODELS,
  AVAILABLE_IMAGEN_MODELS,
  defaultFunctionCallingTool,
  defaultGoogleSearchTool,
  defaultGoogleMapsTool,
} from "../../services/firebaseAIService";
import {
  ModelParams,
  ImagenModelParams,
  HarmCategory,
  HarmBlockThreshold,
  FunctionCallingMode,
  ImagenSafetyFilterLevel,
  ImagenPersonFilterLevel,
  UsageMetadata,
} from "firebase/ai";

interface RightSidebarProps {
  usageMetadata: UsageMetadata | null;
  activeMode: AppMode;
  generativeParams: ModelParams;
  setGenerativeParams: React.Dispatch<React.SetStateAction<ModelParams>>;
  imagenParams: ImagenModelParams;
  setImagenParams: React.Dispatch<React.SetStateAction<ImagenModelParams>>;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  usageMetadata,
  activeMode,
  generativeParams,
  setGenerativeParams,
  imagenParams,
  setImagenParams,
}) => {
  const handleModelParamsUpdate = (
    updateFn: (prevState: ModelParams) => ModelParams,
  ) => {
    setGenerativeParams((prevState) => updateFn(prevState));
  };

  const handleImagenModelParamsUpdate = (
    updateFn: (prevState: ImagenModelParams) => ImagenModelParams,
  ) => {
    setImagenParams((prevState) => updateFn(prevState));
  };

  const getThresholdForCategory = (
    category: HarmCategory,
  ): HarmBlockThreshold => {
    const setting = (generativeParams.safetySettings || []).find(
      (s) => s.category === category,
    );
    return setting?.threshold || HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE;
  };

  const handleGenerativeModelChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newModel = event.target.value;
    handleModelParamsUpdate((prev: ModelParams) => ({
      ...prev,
      model: newModel,
    }));
  };

  const handleTemperatureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTemp = parseFloat(event.target.value);
    handleModelParamsUpdate((prev: ModelParams) => ({
      ...prev,
      generationConfig: { ...prev.generationConfig, temperature: newTemp },
    }));
  };

  const handleTopPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTopP = parseFloat(event.target.value);
    handleModelParamsUpdate((prev: ModelParams) => ({
      ...prev,
      generationConfig: { ...prev.generationConfig, topP: newTopP },
    }));
  };

  const handleTopKChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTopK = parseInt(event.target.value, 10);
    handleModelParamsUpdate((prev: ModelParams) => ({
      ...prev,
      generationConfig: { ...prev.generationConfig, topK: newTopK },
    }));
  };

  const handleSafetySettingChange = (
    category: HarmCategory,
    threshold: HarmBlockThreshold,
  ) => {
    handleModelParamsUpdate((prev: ModelParams) => {
      const currentSettings = prev.safetySettings || [];
      let settingExists = false;
      const newSettings = currentSettings.map((s) => {
        if (s.category === category) {
          settingExists = true;
          return { ...s, threshold };
        }
        return s;
      });
      if (!settingExists) {
        newSettings.push({ category, threshold });
      }
      return { ...prev, safetySettings: newSettings };
    });
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    console.log(`[RightSidebar] Toggle change: ${name}, Checked: ${checked}`);

    handleModelParamsUpdate((prev: ModelParams): ModelParams => {
      // Clone the previous state to avoid direct mutation
      const nextState = JSON.parse(JSON.stringify(prev));

      // Ensure nested objects exist before modifying
      nextState.generationConfig = nextState.generationConfig ?? {};
      nextState.toolConfig = nextState.toolConfig ?? {};

      if (name === "structured-output-toggle") {
        if (checked) {
          // Turn ON JSON
          nextState.generationConfig.responseMimeType = "application/json";
          nextState.generationConfig.responseSchema = undefined; // Use a default schema

          // Turn OFF Function Calling by clearing its related fields
          nextState.tools = undefined;
          nextState.toolConfig = undefined;
        } else {
          // Turn OFF JSON
          nextState.generationConfig.responseMimeType = undefined;
          nextState.generationConfig.responseSchema = undefined;
        }
      } else if (name === "function-call-toggle") {
        if (checked) {
          // Turn ON Function Calling
          // Use default tools if none were previously defined, otherwise keep existing
          nextState.tools =
            prev.tools && prev.tools.length > 0
              ? prev.tools
              : [defaultFunctionCallingTool];
          nextState.toolConfig = {
            functionCallingConfig: { mode: FunctionCallingMode.AUTO },
          };

          // Turn OFF JSON mode by clearing its related fields
          nextState.generationConfig.responseMimeType = undefined;
          nextState.generationConfig.responseSchema = undefined;
        } else {
          // Turn OFF Function Calling
          nextState.tools = undefined;
          nextState.toolConfig = undefined; // Clear config when turning off
        }
      } else if (name === "google-search-toggle") {
        let currentTools = nextState.tools ? [...nextState.tools] : [];
        if (checked) {
          // Add Google Search if not present
          if (!currentTools.some((t) => "googleSearch" in t)) {
            currentTools.push(defaultGoogleSearchTool);
          }
          // Turn OFF JSON mode and Function Calling
          nextState.generationConfig.responseMimeType = undefined;
          nextState.generationConfig.responseSchema = undefined;
          nextState.toolConfig = undefined;
        } else {
          // Remove Google Search
          currentTools = currentTools.filter((t) => !("googleSearch" in t));
        }
        nextState.tools = currentTools.length > 0 ? currentTools : undefined;
      } else if (name === "google-maps-toggle") {
        let currentTools = nextState.tools ? [...nextState.tools] : [];
        if (checked) {
          // Add Google Maps if not present
          if (!currentTools.some((t) => "googleMaps" in t)) {
            currentTools.push(defaultGoogleMapsTool);
          }
          // Turn OFF JSON mode and Function Calling
          nextState.generationConfig.responseMimeType = undefined;
          nextState.generationConfig.responseSchema = undefined;
          nextState.toolConfig = undefined;
        } else {
          // Remove Google Maps
          currentTools = currentTools.filter((t) => !("googleMaps" in t));
        }
        nextState.tools = currentTools.length > 0 ? currentTools : undefined;
      } else if (name === "google-maps-widget-toggle") {
        let currentTools = nextState.tools ? [...nextState.tools] : [];
        const mapToolIndex = currentTools.findIndex((t) => "googleMaps" in t);
        if (mapToolIndex !== -1) {
          // Update existing tool
          currentTools[mapToolIndex] = {
            googleMaps: {
              enableWidget: checked,
            },
          };
          console.error("DEDB tool: ", currentTools[mapToolIndex]);
          nextState.tools = currentTools;
        }
      }
      console.log("[RightSidebar] Updated generative params state:", nextState);
      return nextState;
    });
  };

  const handleLatLngChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "latitude" | "longitude",
  ) => {
    const value = parseFloat(e.target.value);
    handleModelParamsUpdate((prev: ModelParams): ModelParams => {
      const nextState = JSON.parse(JSON.stringify(prev));
      nextState.toolConfig = nextState.toolConfig || {};
      nextState.toolConfig.retrievalConfig =
        nextState.toolConfig.retrievalConfig || {};
      nextState.toolConfig.retrievalConfig.latLng =
        nextState.toolConfig.retrievalConfig.latLng || {};

      if (isNaN(value)) {
        delete nextState.toolConfig.retrievalConfig.latLng[field];
      } else {
        nextState.toolConfig.retrievalConfig.latLng[field] = value;
      }
      return nextState;
    });
  };

  const handleImagenModelChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newModel = event.target.value;
    handleImagenModelParamsUpdate((prev: ImagenModelParams) => ({
      ...prev,
      model: newModel,
    }));
  };
  const handleImagenSamplesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newCount = parseInt(event.target.value, 10);
    handleImagenModelParamsUpdate((prev: ImagenModelParams) => ({
      ...prev,
      generationConfig: { ...prev.generationConfig, numberOfImages: newCount },
    }));
  };
  const handleImagenNegativePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newPrompt = event.target.value || undefined;
    handleImagenModelParamsUpdate((prev: ImagenModelParams) => ({
      ...prev,
      generationConfig: { ...prev.generationConfig, negativePrompt: newPrompt },
    }));
  };
  const handleImagenSafetyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newLevel = event.target.value as ImagenSafetyFilterLevel;
    handleImagenModelParamsUpdate((prev: ImagenModelParams) => ({
      ...prev,
      safetySettings: { ...prev.safetySettings, safetyFilterLevel: newLevel },
    }));
  };
  const handleImagenPersonChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newLevel = event.target.value as ImagenPersonFilterLevel;
    handleImagenModelParamsUpdate((prev: ImagenModelParams) => ({
      ...prev,
      safetySettings: { ...prev.safetySettings, personFilterLevel: newLevel },
    }));
  };

  // Derive UI state from config
  const isStructuredOutputActive =
    generativeParams.generationConfig?.responseMimeType === "application/json";
  const isFunctionCallingActive =
    (generativeParams.toolConfig?.functionCallingConfig?.mode ===
      FunctionCallingMode.AUTO ||
      generativeParams.toolConfig?.functionCallingConfig?.mode ===
        FunctionCallingMode.ANY) &&
    !!generativeParams.tools?.length;
  const isGroundingWithGoogleSearchActive = !!generativeParams.tools?.some(
    (tool) => "googleSearch" in tool,
  );
  const isGroundingWithGoogleMapsActive = !!generativeParams.tools?.some(
    (tool) => "googleMaps" in tool,
  );
  // Check if widget is enabled in the first Google Maps tool found
  const isGoogleMapsWidgetEnabled = !!generativeParams.tools?.find(
    (tool) => "googleMaps" in tool,
  )?.googleMaps?.enableWidget;

  const currentLatLng = generativeParams.toolConfig?.retrievalConfig?.latLng;
  const isLatLngInvalid =
    (currentLatLng?.latitude !== undefined &&
      currentLatLng?.longitude === undefined) ||
    (currentLatLng?.latitude === undefined &&
      currentLatLng?.longitude !== undefined);

  return (
    <div className={styles.rightSidebarContainer}>
      {/* Generative Model Settings */}
      {activeMode === "chat" && (
        <>
          <div>
            <h5 className={styles.subSectionTitle}>
              Generative Model Settings
            </h5>
            <div className={styles.controlGroup}>
              <label htmlFor="model-select">Model</label>
              <select
                id="model-select"
                value={generativeParams.model}
                onChange={handleGenerativeModelChange}
              >
                {AVAILABLE_GENERATIVE_MODELS.map((modelName) => (
                  <option key={modelName} value={modelName}>
                    {modelName}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.controlGroup}>
              <label htmlFor="temperature-slider">
                Temperature:{" "}
                {generativeParams.generationConfig?.temperature?.toFixed(1) ??
                  "N/A"}
              </label>
              <input
                type="range"
                id="temperature-slider"
                min="0"
                max="2"
                step="0.1"
                value={generativeParams.generationConfig?.temperature ?? 0.9}
                onChange={handleTemperatureChange}
              />
            </div>
            <div className={styles.controlGroup}>
              <label>Last Response Tokens</label>
              <div className={styles.tokenDisplay}>
                {usageMetadata
                  ? `Prompt: ${usageMetadata.promptTokenCount} / Candidate: ${usageMetadata.candidatesTokenCount} / Total: ${usageMetadata.totalTokenCount}`
                  : `N/A`}
              </div>
            </div>
          </div>

          <div>
            <h5
              className={styles.subSectionTitle}
              style={{ marginTop: "20px" }}
            >
              Advanced Generation
            </h5>
            <div className={styles.controlGroup}>
              <label htmlFor="topP-slider">
                Top P:{" "}
                {generativeParams.generationConfig?.topP?.toFixed(2) ??
                  "N/A (Default)"}
              </label>
              <input
                type="range"
                id="topP-slider"
                min="0"
                max="1"
                step="0.01"
                value={generativeParams.generationConfig?.topP ?? 0.95}
                onChange={handleTopPChange}
              />
            </div>
            <div className={styles.controlGroup}>
              <label htmlFor="topK-slider">
                Top K:{" "}
                {generativeParams.generationConfig?.topK ?? "N/A (Default)"}
              </label>
              <input
                type="range"
                id="topK-slider"
                min="1"
                max="100"
                step="1"
                value={generativeParams.generationConfig?.topK ?? 40}
                onChange={handleTopKChange}
              />
            </div>
          </div>

          <div>
            <h5
              className={styles.subSectionTitle}
              style={{ marginTop: "20px" }}
            >
              Safety Settings
            </h5>
            {Object.values(HarmCategory).map((category) => (
              <div className={styles.controlGroup} key={category}>
                <label htmlFor={`safety-${category}`}>
                  {category
                    .replace("HARM_CATEGORY_", "")
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <select
                  id={`safety-${category}`}
                  value={getThresholdForCategory(category)}
                  onChange={(e) =>
                    handleSafetySettingChange(
                      category,
                      e.target.value as HarmBlockThreshold,
                    )
                  }
                >
                  {Object.values(HarmBlockThreshold).map((threshold) => (
                    <option key={threshold} value={threshold}>
                      {threshold.replace("BLOCK_", "").replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div>
            <h5 className={styles.subSectionTitle}>Tools</h5>
            <div className={styles.groupContainer}>
              <div
                className={`${styles.toggleGroup} ${isFunctionCallingActive ? styles.disabledText : ""}`}
              >
                <label htmlFor="structured-output-toggle">
                  Structured output (JSON)
                </label>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="structured-output-toggle"
                    name="structured-output-toggle"
                    checked={isStructuredOutputActive}
                    onChange={handleToggleChange}
                    disabled={
                      isFunctionCallingActive ||
                      isGroundingWithGoogleSearchActive ||
                      isGroundingWithGoogleMapsActive
                    }
                  />
                  <span
                    className={`${styles.slider} ${isFunctionCallingActive || isGroundingWithGoogleSearchActive || isGroundingWithGoogleMapsActive ? styles.disabled : ""}`}
                  ></span>
                </label>
              </div>
            </div>
            <div className={styles.groupContainer}>
              <div
                className={`${styles.toggleGroup} ${isStructuredOutputActive || isGroundingWithGoogleSearchActive ? styles.disabledText : ""}`}
              >
                <label htmlFor="function-call-toggle">Function calling</label>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="function-call-toggle"
                    name="function-call-toggle"
                    checked={isFunctionCallingActive}
                    onChange={handleToggleChange}
                    disabled={
                      isStructuredOutputActive ||
                      isGroundingWithGoogleSearchActive ||
                      isGroundingWithGoogleMapsActive
                    }
                  />
                  <span
                    className={`${styles.slider} ${isStructuredOutputActive ? styles.disabled : ""}`}
                  ></span>
                </label>
              </div>
            </div>
            <div className={styles.groupContainer}>
              <div
                className={`${styles.toggleGroup} ${isStructuredOutputActive || isFunctionCallingActive
                  ? styles.disabledText
                  : ""
                  }`}
              >
                <label htmlFor="google-search-toggle">
                  Grounding with Google Search
                </label>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="google-search-toggle"
                    name="google-search-toggle"
                    checked={isGroundingWithGoogleSearchActive}
                    onChange={handleToggleChange}
                    disabled={
                      isStructuredOutputActive || isFunctionCallingActive
                    }
                  />
                  <span
                    className={`${styles.slider} ${isStructuredOutputActive ||
                      isFunctionCallingActive ||
                      isGroundingWithGoogleMapsActive
                      ? styles.disabled
                      : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {/* Google Maps Grounding Group */}
            <div className={styles.groupContainer}>
              <div
                className={`${styles.toggleGroup} ${isStructuredOutputActive ||
                  isFunctionCallingActive ||
                  isGroundingWithGoogleSearchActive
                  ? styles.disabledText
                  : ""
                  }`}
              >
                <label htmlFor="google-maps-toggle">
                  Grounding with Google Maps
                </label>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="google-maps-toggle"
                    name="google-maps-toggle"
                    checked={isGroundingWithGoogleMapsActive}
                    onChange={handleToggleChange}
                    disabled={
                      isStructuredOutputActive || isFunctionCallingActive
                    }
                  />
                  <span
                    className={`${styles.slider} ${
                      isStructuredOutputActive || isFunctionCallingActive
                        ? styles.disabled
                        : ""
                      }`}
                  ></span>
                </label>
              </div>
              {/* Indented Widget Toggle */}
              <div
                className={`${styles.toggleGroup} ${!isGroundingWithGoogleMapsActive ? styles.disabledText : ""}`}
                style={{ paddingLeft: "10px" }}
              >
                <label htmlFor="google-maps-widget-toggle">Enable Widget</label>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="google-maps-widget-toggle"
                    name="google-maps-widget-toggle"
                    checked={isGoogleMapsWidgetEnabled}
                    onChange={handleToggleChange}
                    disabled={!isGroundingWithGoogleMapsActive}
                  />
                  <span
                    className={`${styles.slider} ${!isGroundingWithGoogleMapsActive ? styles.disabled : ""}`}
                  ></span>
                </label>
              </div>
              {/* Location Context Inputs */}
              <div
                className={`${styles.controlGroup} ${!isGroundingWithGoogleMapsActive ? styles.disabledText : ""}`}
                style={{ paddingLeft: "10px", marginTop: "10px", marginBottom: 0 }}
              >
                <label>Location Context</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="number"
                    placeholder="Lat"
                    value={currentLatLng?.latitude ?? ""}
                    onChange={(e) => handleLatLngChange(e, "latitude")}
                    disabled={!isGroundingWithGoogleMapsActive}
                    style={{ width: "50%" }}
                  />
                  <input
                    type="number"
                    placeholder="Lng"
                    value={currentLatLng?.longitude ?? ""}
                    onChange={(e) => handleLatLngChange(e, "longitude")}
                    disabled={!isGroundingWithGoogleMapsActive}
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
              {isGroundingWithGoogleMapsActive && isLatLngInvalid && (
                <div className={styles.errorBanner}>
                  <span>⚠️</span>
                  <span>
                    Both Latitude and Longitude must be provided if one is set.
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Imagen Settings */}
      {activeMode === "imagenGen" && (
        <div>
          <h5 className={styles.subSectionTitle}>Imagen Settings</h5>
          <div className={styles.controlGroup}>
            <label htmlFor="imagen-model-select">Model</label>
            <select
              id="imagen-model-select"
              value={imagenParams.model}
              onChange={handleImagenModelChange}
            >
              {AVAILABLE_IMAGEN_MODELS.map((modelName) => (
                <option key={modelName} value={modelName}>
                  {modelName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="imagen-samples">Number of Images</label>
            <input
              type="number"
              id="imagen-samples"
              min="1"
              max="4"
              step="1"
              value={imagenParams.generationConfig?.numberOfImages ?? 1}
              onChange={handleImagenSamplesChange}
            />
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="imagen-negative-prompt">Negative Prompt</label>
            <textarea
              id="imagen-negative-prompt"
              rows={2}
              value={imagenParams.generationConfig?.negativePrompt || ""}
              onChange={handleImagenNegativePromptChange}
              className={styles.textAreaInput}
            />
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="imagen-safety-select">Safety Filter Level</label>
            <select
              id="imagen-safety-select"
              value={imagenParams.safetySettings?.safetyFilterLevel || ""}
              onChange={handleImagenSafetyChange}
            >
              <option value="" disabled>
                Select Level
              </option>
              {Object.values(ImagenSafetyFilterLevel).map((level) => (
                <option key={level} value={level}>
                  {level.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="imagen-person-select">Person Filter Level</label>
            <select
              id="imagen-person-select"
              value={imagenParams.safetySettings?.personFilterLevel || ""}
              onChange={handleImagenPersonChange}
            >
              <option value="" disabled>
                Select Level
              </option>
              {Object.values(ImagenPersonFilterLevel).map((level) => (
                <option key={level} value={level}>
                  {level.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
