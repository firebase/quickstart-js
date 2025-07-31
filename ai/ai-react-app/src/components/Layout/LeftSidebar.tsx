import React, { useState, useEffect } from "react";
import { AppMode } from "../../App";
import styles from "./LeftSidebar.module.css";
import { BackendType, ModelParams } from "firebase/ai";
import { PREDEFINED_PERSONAS } from "../../config/personas";

interface LeftSidebarProps {
  /** The currently active application mode (e.g., 'chat', 'imagenGen'). */
  activeMode: AppMode;
  /** Function to call when a mode button is clicked, updating the active mode in the parent. */
  setActiveMode: (mode: AppMode) => void;
  activeBackend: BackendType;
  setActiveBackend: (backend: BackendType) => void;
  generativeParams: ModelParams;
  setGenerativeParams: (
    params: ModelParams | ((prevState: ModelParams) => ModelParams),
  ) => void;
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
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("default");
  const [customPersona, setCustomPersona] = useState<string>("");

  // Effect to update systemInstruction when persona changes
  useEffect(() => {
    const selected = PREDEFINED_PERSONAS.find(
      (p) => p.id === selectedPersonaId,
    );
    if (!selected) return;

    const newInstructionText =
      selected.id === "custom" ? customPersona : selected.systemInstruction;

    setGenerativeParams((prevParams) => {
      const newSystemInstruction = newInstructionText
        ? { parts: [{ text: newInstructionText }] }
        : undefined;

      const currentInstructionText = prevParams.systemInstruction?.parts?.[0]?.text;

      // Only update if the text content has actually changed.
      if ((newInstructionText || "") !== (currentInstructionText || "")) {
        return {
          ...prevParams,
          systemInstruction: newSystemInstruction,
        };
      }
      // If no change, return the previous state to prevent re-render.
      return prevParams;
    });
  }, [selectedPersonaId, customPersona, setGenerativeParams]);

  // Define the available modes and their display names
  const modes: { id: AppMode; label: string }[] = [
    { id: "chat", label: "Chat" },
    { id: "imagenGen", label: "Imagen Generation" },
  ];

  const handleBackendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveBackend(event.target.value as BackendType);
  };

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonaId(e.target.value);
  };

  const handleCustomPersonaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCustomPersona(e.target.value);
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
        <h6 className={styles.selectorTitle}>Backend API</h6>
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
          <h6 className={styles.selectorTitle}>Persona</h6>
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
