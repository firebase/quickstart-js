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

  // Memoize the calculation of the new instruction text based on UI state.
  const newInstructionText = React.useMemo(() => {
    const selected = PREDEFINED_PERSONAS.find(
      (p) => p.id === selectedPersonaId,
    );
    if (!selected) return ""; // Should not happen, but a safe fallback.

    return selected.id === "custom"
      ? customPersona
      : selected.systemInstruction;
  }, [selectedPersonaId, customPersona]);

  // Effect to sync UI changes (from dropdown or textarea) UP to the parent state.
  useEffect(() => {
    setGenerativeParams((prevParams) => {
      const currentInstructionText =
        prevParams.systemInstruction?.parts?.[0]?.text ?? "";

      // Only update if the text content has actually changed to prevent re-renders.
      if (newInstructionText === currentInstructionText) {
        return prevParams;
      }

      const newSystemInstruction = newInstructionText
        ? { parts: [{ text: newInstructionText }] }
        : undefined;

      return {
        ...prevParams,
        systemInstruction: newSystemInstruction,
      };
    });
  }, [newInstructionText, setGenerativeParams]);

  // Effect to sync parent state changes DOWN to the local UI state.
  // This ensures the UI reflects the state if it's changed elsewhere.
  useEffect(() => {
    const instructionText =
      generativeParams.systemInstruction?.parts?.[0]?.text ?? "";

    const matchingPersona = PREDEFINED_PERSONAS.find(
      (p) => p.id !== "custom" && p.systemInstruction === instructionText,
    );

    if (matchingPersona) {
      // A predefined persona matches the current instruction.
      setSelectedPersonaId(matchingPersona.id);
      setCustomPersona("");
    } else {
      // No predefined persona matches. It's either custom or the default empty state.
      if (instructionText) {
        // It's a custom persona.
        setSelectedPersonaId("custom");
        setCustomPersona(instructionText);
      } else {
        // It's the default empty state.
        setSelectedPersonaId("default");
        setCustomPersona("");
      }
    }
  }, [generativeParams.systemInstruction]);

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
