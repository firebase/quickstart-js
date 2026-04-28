import React from "react";
import { AppMode } from "../../App";
import styles from "./RightSidebar.module.css";
import {
  AVAILABLE_GENERATIVE_MODELS,
  AVAILABLE_NANO_BANANA_MODELS,
  defaultFunctionCallingTool,
  defaultGoogleSearchTool,
} from "../../services/firebaseAIService";
import {
  ModelParams,
  GenerationConfig,
  HarmCategory,
  HarmBlockThreshold,
  FunctionCallingMode,
  UsageMetadata,
  ResponseModality,
  InferenceMode,
} from "firebase/ai";

export interface ExtendedGenerationConfig extends GenerationConfig {
  responseModalities?: ResponseModality[];
}

export interface ExtendedModelParams extends ModelParams {
  generationConfig?: ExtendedGenerationConfig;
}

interface RightSidebarProps {
  usageMetadata: UsageMetadata | null;
  activeMode: AppMode;
  generativeParams: ModelParams;
  setGenerativeParams: React.Dispatch<React.SetStateAction<ModelParams>>;
  nanoBananaParams: ModelParams;
  setNanoBananaParams: React.Dispatch<React.SetStateAction<ModelParams>>;
  selectedAspectRatio?: string;
  setSelectedAspectRatio: (ar?: string) => void;
  isHybridMode: boolean;
  setIsHybridMode: React.Dispatch<React.SetStateAction<boolean>>;
  inferenceMode: InferenceMode;
  setInferenceMode: React.Dispatch<React.SetStateAction<InferenceMode>>;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  usageMetadata,
  activeMode,
  generativeParams,
  setGenerativeParams,
  nanoBananaParams,
  setNanoBananaParams,
  selectedAspectRatio,
  setSelectedAspectRatio,
  isHybridMode,
  setIsHybridMode,
  inferenceMode,
  setInferenceMode,
}) => {
  const [schemaText, setSchemaText] = React.useState(
    JSON.stringify(generativeParams.generationConfig?.responseJsonSchema || {}, null, 2)
  );
  const [modelStatus, setModelStatus] = React.useState<string>("unknown");

  React.useEffect(() => {
    setSchemaText(
      JSON.stringify(generativeParams.generationConfig?.responseJsonSchema || {}, null, 2)
    );
  }, [generativeParams.generationConfig?.responseJsonSchema]);

  React.useEffect(() => {
    if (isHybridMode) {
      checkModelAvailability();
    }
  }, [isHybridMode]);

  const checkModelAvailability = async () => {
    setModelStatus("checking");
    try {
      const ai = (window as any).LanguageModel;
      if (!ai) {
        setModelStatus("unavailable");
        return;
      }
      const availability = await ai.availability();
      setModelStatus(availability);
    } catch (err) {
      console.error("Error checking model availability:", err);
      setModelStatus("error");
    }
  };

  const handleDownloadModel = async () => {
    setModelStatus("downloading");
    try {
      const ai = (window as any).LanguageModel;
      if (ai) {
        await ai.create();
        setModelStatus("available");
      }
    } catch (err) {
      console.error("Error downloading model:", err);
      setModelStatus("error");
    }
  };

  const handleModelParamsUpdate = (
    updateFn: (prevState: ModelParams) => ModelParams,
  ) => {
    setGenerativeParams((prevState) => updateFn(prevState));
  };

  const handleNanoBananaModelParamsUpdate = (
    updateFn: (prevState: ModelParams) => ModelParams,
  ) => {
    setNanoBananaParams((prevState) => updateFn(prevState));
  };

  const handleModalityChange = (modality: ResponseModality, checked: boolean) => {
    handleNanoBananaModelParamsUpdate((prev) => {
      const currentModalities = (prev.generationConfig as ExtendedGenerationConfig)?.responseModalities || [ResponseModality.TEXT];
      let newModalities = [...currentModalities];
      if (checked) {
        if (!newModalities.includes(modality)) newModalities.push(modality);
      } else {
        newModalities = newModalities.filter((m) => m !== modality);
      }
      if (newModalities.length === 0) return prev;
      return { ...prev, generationConfig: { ...prev.generationConfig, responseModalities: newModalities } };
    });
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
          nextState.generationConfig.responseJsonSchema = { type: "object", properties: {} }; // Default schema
          nextState.generationConfig.responseSchema = undefined;

          // Turn OFF Function Calling by clearing its related fields
          nextState.generationConfig.responseSchema = undefined;
          nextState.tools = undefined;
          nextState.toolConfig = undefined;
        } else {
          // Turn OFF JSON
          nextState.generationConfig.responseMimeType = undefined;
          nextState.generationConfig.responseJsonSchema = undefined;
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
          nextState.generationConfig.responseJsonSchema = undefined;
          nextState.generationConfig.responseSchema = undefined;
        } else {
          // Turn OFF Function Calling
          nextState.tools = undefined;
          nextState.toolConfig = undefined; // Clear config when turning off
        }
      } else if (name === "google-search-toggle") {
        if (checked) {
          // Turn ON Google Search Grounding
          nextState.tools = [defaultGoogleSearchTool];

          // Turn OFF JSON mode and Function Calling
          nextState.generationConfig.responseMimeType = undefined;
          nextState.generationConfig.responseJsonSchema = undefined;
          nextState.generationConfig.responseSchema = undefined;
          nextState.toolConfig = undefined;
        } else {
          // Turn OFF Google Search Grounding
          nextState.tools = undefined;
        }
      }
      return nextState;
    });
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
            <div className={styles.toggleGroup}>
              <label htmlFor="hybrid-mode-toggle">Hybrid Mode</label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  id="hybrid-mode-toggle"
                  name="hybrid-mode-toggle"
                  checked={isHybridMode}
                  onChange={(e) => setIsHybridMode(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            {isHybridMode && (
              <>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px', marginBottom: '10px' }}>
                  To use on-device inference, ensure you have enabled the Prompt API in Chrome and downloaded the model.
                  See <a href="https://developer.chrome.com/docs/ai/prompt-api" target="_blank" rel="noopener noreferrer">Chrome AI Prompt API</a> for details.
                </div>
                <div className={styles.controlGroup}>
                  <label>Model Status</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{modelStatus}</span>
                    {modelStatus === "downloadable" && (
                      <button onClick={handleDownloadModel} style={{ padding: '2px 5px', fontSize: '0.8rem' }}>
                        Download
                      </button>
                    )}
                    {modelStatus === "downloading" && (
                      <span className={styles.spinner}>⏳</span> // Using an emoji as a simple spinner
                    )}
                  </div>
                </div>
                <div className={styles.controlGroup}>
                  <label htmlFor="inference-mode-select">Inference Mode</label>
                  <select
                    id="inference-mode-select"
                    value={inferenceMode}
                    onChange={(e) => setInferenceMode(e.target.value as InferenceMode)}
                  >
                    <option value={InferenceMode.PREFER_ON_DEVICE}>Prefer On-Device</option>
                    <option value={InferenceMode.ONLY_ON_DEVICE}>Only On-Device</option>
                    <option value={InferenceMode.ONLY_IN_CLOUD}>Only In-Cloud</option>
                    <option value={InferenceMode.PREFER_IN_CLOUD}>Prefer In-Cloud</option>
                  </select>
                </div>
              </>
            )}
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
                    isFunctionCallingActive || isGroundingWithGoogleSearchActive
                  }
                />
                <span
                  className={`${styles.slider} ${isFunctionCallingActive || isGroundingWithGoogleSearchActive ? styles.disabled : ""}`}
                ></span>
              </label>
            </div>
            {isStructuredOutputActive && (
              <div className={styles.controlGroup} style={{ marginTop: "10px", marginBottom: "10px" }}>
                <label htmlFor="json-schema-input" style={{ display: "block", marginBottom: "5px" }}>JSON Schema</label>
                <textarea
                  id="json-schema-input"
                  rows={5}
                  placeholder='e.g. { "type": "object", "properties": { "response": { "type": "string" } } }'
                  value={schemaText}
                  onChange={(e) => {
                    setSchemaText(e.target.value);
                    try {
                      const schema = JSON.parse(e.target.value);
                      handleModelParamsUpdate((prev: ModelParams) => ({
                        ...prev,
                        generationConfig: {
                          ...prev.generationConfig,
                          responseJsonSchema: schema,
                        },
                      }));
                    } catch (err) {
                      // Ignore invalid JSON while typing
                    }
                  }}
                  style={{ width: "100%", fontFamily: "monospace", fontSize: "0.8rem", padding: "5px", boxSizing: "border-box" }}
                />
              </div>
            )}
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
                    isGroundingWithGoogleSearchActive
                  }
                />
                <span
                  className={`${styles.slider} ${isStructuredOutputActive ? styles.disabled : ""}`}
                ></span>
              </label>
            </div>
            <div
              className={`${styles.toggleGroup} ${
                isStructuredOutputActive || isFunctionCallingActive
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
                  disabled={isStructuredOutputActive || isFunctionCallingActive}
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
          </div>
        </>
      )}

      {/* Nano Banana Settings */}
      {activeMode === "nanobanana" && (
        <div>
          <h5 className={styles.subSectionTitle}>Nano Banana Settings</h5>
          <div className={styles.controlGroup}>
            <label htmlFor="nanobanana-model-select">Model</label>
            <select
              id="nanobanana-model-select"
              value={nanoBananaParams.model}
              onChange={(e) => handleNanoBananaModelParamsUpdate((prev) => ({ ...prev, model: e.target.value }))}
            >
              {AVAILABLE_NANO_BANANA_MODELS.map((modelName) => (
                <option key={modelName} value={modelName}>
                  {modelName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Response Modalities</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={((nanoBananaParams.generationConfig as ExtendedGenerationConfig)?.responseModalities || [ResponseModality.TEXT]).includes(ResponseModality.TEXT)}
                  onChange={(e) => handleModalityChange(ResponseModality.TEXT, e.target.checked)}
                />
                Text
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={((nanoBananaParams.generationConfig as ExtendedGenerationConfig)?.responseModalities || []).includes(ResponseModality.IMAGE)}
                  onChange={(e) => handleModalityChange(ResponseModality.IMAGE, e.target.checked)}
                />
                Image
              </label>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="aspect-ratio-select">Aspect Ratio</label>
            <select
              id="aspect-ratio-select"
              value={selectedAspectRatio || ""}
              onChange={(e) => setSelectedAspectRatio(e.target.value || undefined)}
            >
              <option value="">None</option>
              {["1:1", "3:2", "2:3", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"].map((ar) => (
                <option key={ar} value={ar}>
                  {ar}
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
