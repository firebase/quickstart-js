import React, { useState } from "react";
import { AppMode } from "../../App";
import styles from "./LeftSidebar.module.css";
import { BackendType, Content, ModelParams } from "firebase/ai";
import { PREDEFINED_PERSONAS } from "../../config/personas";

interface LeftSidebarProps {
  /** The currently active application mode (e.g., 'chat', 'imagenGen'). */
  activeMode: AppMode;
  /** Function to call when a mode button is clicked, updating the active mode in the parent. */
  setActiveMode: (mode: AppMode) => void;
  activeBackend: BackendType;
  setActiveBackend: (backend: BackendType) => void;
  generativeParams: ModelParams;
  setGenerativeParams: React.Dispatch<React.SetStateAction<ModelParams>>;
}

/**
 * Renders the left navigation sidebar allowing users to switch between application modes.
 */
const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeMode,
  setActiveMode,
  activeBackend,
  setActiveBackend,
  generativeParams,
  setGenerativeParams,
}) => {
  // This component now manages its own UI state and pushes updates upwards.
  // It does not rely on a useEffect to sync systemInstruction from the parent,
  // following the pattern in RightSidebar.tsx to prevent state-reversion bugs.
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("default");
  const [customPersona, setCustomPersona] = useState<string>("");

  const handleModelParamsUpdate = (
    updateFn: (prevState: ModelParams) => ModelParams,
  ) => {
    setGenerativeParams((prevState) => updateFn(prevState));
  };

  // Define the available modes and their display names
  const modes: { id: AppMode; label: string }[] = [
    { id: "chat", label: "Chat" },
    { id: "imagenGen", label: "Imagen Generation" },
  ];

  const handleBackendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveBackend(event.target.value as BackendType);
  };

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPersonaId = e.target.value;
    setSelectedPersonaId(newPersonaId); // 1. Update UI state

    let newSystemInstructionText: string;

    if (newPersonaId === "custom") {
      // When switching to custom, the instruction is whatever is in the textarea.
      newSystemInstructionText = customPersona;
    } else {
      // When switching to a predefined persona, find its instruction text.
      const selected = PREDEFINED_PERSONAS.find((p) => p.id === newPersonaId);
      newSystemInstructionText = selected?.systemInstruction ?? "";
      // We are no longer in 'custom', but we don't clear the customPersona state
      // in case the user wants to switch back and forth.
    }

    const newSystemInstruction: Content | undefined = newSystemInstructionText
      ? { parts: [{ text: newSystemInstructionText }], role: "system" }
      : undefined;

    // 2. Update model state upwards
    handleModelParamsUpdate((prev: ModelParams) => ({
      ...prev,
      systemInstruction: newSystemInstruction,
    }));
  };

  const handleCustomPersonaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newSystemInstructionText = e.target.value;
    setCustomPersona(newSystemInstructionText); // 1. Update UI state

    const newSystemInstruction: Content | undefined = newSystemInstructionText
      ? { parts: [{ text: newSystemInstructionText }], role: "system" }
      : undefined;

    // 2. Update model state upwards
    handleModelParamsUpdate((prev: ModelParams) => ({
      ...prev,
      systemInstruction: newSystemInstruction,
    }));
  };

  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <ul>
        {modes.map((modeInfo) => (
          <li key={modeInfo.id}>
            <button
              // Apply 'active' style if this button's mode matches the current activeMode
              className={`${styles.navButton} ${activeMode === modeInfo.id ? styles.active : ""}`}
              onClick={() => setActiveMode(modeInfo.id)}
              aria-current={activeMode === modeInfo.id ? "page" : undefined}
            >
              {modeInfo.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Backend Selection */}
      <div className={styles.backendSelector}>
        <h5 className={styles.selectorTitle}>Backend API</h5>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="backend"
              value={BackendType.GOOGLE_AI}
              checked={activeBackend === BackendType.GOOGLE_AI}
              onChange={handleBackendChange}
            />
            Gemini Developer API
          </label>
        </div>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="backend"
              value={BackendType.VERTEX_AI}
              checked={activeBackend === BackendType.VERTEX_AI}
              onChange={handleBackendChange}
            />
            Vertex AI Gemini API
          </label>
        </div>
      </div>

      {/* Persona Selector */}
      {activeMode === "chat" && (
        <div className={styles.personaSelector}>
          <h5 className={styles.selectorTitle}>Persona</h5>
          <select
            value={selectedPersonaId}
            onChange={handlePersonaChange}
            className={styles.personaDropdown}
          >
            {PREDEFINED_PERSONAS.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.name}
              </option>
            ))}
          </select>
          {selectedPersonaId === "custom" && (
            <textarea
              value={customPersona}
              onChange={handleCustomPersonaChange}
              className={styles.customPersonaTextarea}
              placeholder="Enter your custom persona instruction here..."
              rows={5}
            />
          )}
        </div>
      )}
    </nav>
  );
};

export default LeftSidebar;
