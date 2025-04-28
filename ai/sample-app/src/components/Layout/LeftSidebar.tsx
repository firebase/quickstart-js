import React from "react";
import { AppMode } from "../../App";
import styles from "./LeftSidebar.module.css";
import { BackendType } from "firebase/ai";

interface LeftSidebarProps {
  /** The currently active application mode (e.g., 'chat', 'imagenGen'). */
  activeMode: AppMode;
  /** Function to call when a mode button is clicked, updating the active mode in the parent. */
  setActiveMode: (mode: AppMode) => void;
  activeBackend: BackendType;
  setActiveBackend: (backend: BackendType) => void;
}

/**
 * Renders the left navigation sidebar allowing users to switch between application modes.
 */
const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeMode,
  setActiveMode,
  activeBackend,
  setActiveBackend,
}) => {
  // Define the available modes and their display names
  const modes: { id: AppMode; label: string }[] = [
    { id: "chat", label: "Chat" },
    { id: "imagenGen", label: "Imagen Generation" },
  ];

  const handleBackendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveBackend(event.target.value as BackendType);
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
    </nav>
  );
};

export default LeftSidebar;
