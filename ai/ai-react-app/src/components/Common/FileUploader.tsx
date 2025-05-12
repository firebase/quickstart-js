import React, { useState, useRef, ChangeEvent } from "react";
import styles from "./FileUploader.module.css";

interface FileUploaderProps {
  /** Callback triggered when a file is selected or cleared. Passes the File object or null. */
  onFileSelect: (file: File | null) => void;
  /** Standard HTML 'accept' attribute string (e.g., "image/*", ".pdf", "image/png,image/jpeg"). */
  accept: string;
  /** Optional text label for the button when no file is selected. */
  label?: string;
  /** Disables the uploader if true. */
  disabled?: boolean;
}

/**
 * A simple file uploader component using a styled button
 * to trigger a hidden file input.
 */
const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept,
  label = "Select File",
  disabled = false,
}) => {
  // State to store the name of the selected file for display purposes.
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  // Ref to access the hidden file input element directly.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handles the change event when a file is selected via the input.
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onFileSelect(file); // Notify parent component
    } else {
      // If no file is selected (e.g., user cancels the dialog)
      setSelectedFileName(null);
      onFileSelect(null);
    }
    // Reset the input value. This allows selecting the same file again
    // if the user clears it and then wants to re-select it immediately.
    if (event.target) {
      event.target.value = "";
    }
  };

  // Triggers the click event on the hidden file input when the button is clicked.
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Clears the current file selection.
  const handleClearClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the button click underneath
    setSelectedFileName(null);
    onFileSelect(null); // Notify parent
    // Also clear the hidden input's value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.uploaderContainer}>
      {/* Hidden actual file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: "none" }} // Keep it hidden
        disabled={disabled}
        aria-hidden="true" // Improve accessibility
      />
      {/* The visible button that acts as the file selector */}
      <button
        type="button" // Prevents form submission if used within a <form>
        className={styles.uploadButton}
        onClick={handleButtonClick}
        disabled={disabled}
        title={selectedFileName ? `File: ${selectedFileName}` : label} // Tooltip
      >
        {/* Display file name or label */}
        {selectedFileName ? `Selected: ${selectedFileName}` : label}
      </button>
      {/* Show clear button only when a file is selected */}
      {selectedFileName && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClearClick}
          disabled={disabled}
          title="Clear file selection" // Tooltip for accessibility
          aria-label="Clear file selection" // Aria label
        >
          × {/* Using a simple 'times' character for clear */}
        </button>
      )}
    </div>
  );
};

export default FileUploader;
