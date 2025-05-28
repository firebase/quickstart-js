import React, { useState, useCallback, useRef } from "react";
import {
  getImagenModel,
  ImagenModelParams,
  ImagenInlineImage,
  ImagenGenerationResponse,
  AI,
  AIError,
  SingleRequestOptions,
} from "firebase/ai";
import PromptInput from "../components/Common/PromptInput";
import styles from "./ImagenView.module.css";

const ImageDisplay: React.FC<{
  images: ImagenInlineImage[];
  filteredReason?: string;
  isLoading: boolean;
}> = ({ images, filteredReason, isLoading }) => {
  return (
    <div className={styles.imageDisplayContainer}>
      {isLoading && <div className={styles.loading}>Generating images...</div>}
      {!isLoading && images.length === 0 && !filteredReason && (
        <div className={styles.placeholder}>
          Generated images will appear here.
        </div>
      )}
      {filteredReason && (
        <div className={styles.filteredReason}>Filtered: {filteredReason}</div>
      )}
      <div className={styles.imageList}>
        {images.map((img, index) => (
          <div key={index} className={styles.imageWrapper}>
            <img
              src={`data:${img.mimeType};base64,${img.bytesBase64Encoded}`}
              alt={`Generated image ${index + 1}`}
              className={styles.generatedImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ImagenViewProps {
  currentParams: ImagenModelParams;
  aiInstance: AI;
}

const ImagenView: React.FC<ImagenViewProps> = ({
  currentParams,
  aiInstance,
}) => {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImages, setResultImages] = useState<ImagenInlineImage[]>([]);
  const [filteredReason, setFilteredReason] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleImageGenerationSubmit = useCallback(async () => {
    if (!currentPrompt.trim() || isLoading) {
      return;
    }

    const promptText = currentPrompt.trim();
    console.log(
      `[ImagenView] Starting generation for prompt: "${promptText}" with params:`,
      currentParams,
    );
    setIsLoading(true);
    setResultImages([]);
    setFilteredReason(undefined);
    setError(null);

    abortControllerRef.current = new AbortController();
    const singleRequestOptions: SingleRequestOptions = {
      signal: abortControllerRef.current.signal,
    };

    try {
      const imagenModel = getImagenModel(aiInstance, currentParams);
      console.log(`[ImagenView] Using Imagen model: ${imagenModel.model}`);

      const result: ImagenGenerationResponse<ImagenInlineImage> =
        await imagenModel.generateImages(promptText, singleRequestOptions);

      console.log("[ImagenView] Image generation successful.", result);
      setResultImages(result.images);
      setFilteredReason(result.filteredReason);
    } catch (err: unknown) {
      console.log(err, (err as any).name);
      if (err instanceof DOMException) {
        console.log("[ImagenView] Image generation was cancelled by user.");
        // No error state set, UI remains as is (e.g. "Generating images...")
      } else {
        console.error("[ImagenView] Error during image generation:", err);
        if (err instanceof AIError) {
          const message =
            err.message || "Failed to generate images due to an unknown error.";
          const details = err.customErrorData?.errorDetails
            ? ` Details: ${JSON.stringify(err.customErrorData.errorDetails)}`
            : "";
          setError(`Error: ${message}${details}`);
        } else {
          setError("Failed to generate images due to an unknown error.");
        }
        setResultImages([]); // Clear images on actual error
      }
    } finally {
      setIsLoading(false);
      if (!(currentPrompt && abortControllerRef.current?.signal.aborted)) {
        setCurrentPrompt(""); // Clear prompt only if not aborted or if it was successful.
      }
    }
  }, [currentPrompt, isLoading, currentParams, aiInstance]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      console.log("[ImagenView] User requested cancellation via button.");
      abortControllerRef.current.abort("User cancelled the image generation.");
    }
  }, []);

  const suggestions = [
    "A photorealistic portrait of a tabby cat wearing sunglasses.",
    "Impressionist painting of a sunflower field at sunset.",
    "Logo for a coffee shop called 'The Daily Grind', minimalist style.",
    "Pixel art sprite of a friendly robot navigating a maze.",
  ];
  const handleSuggestion = (suggestion: string) => {
    setCurrentPrompt(suggestion);
  };

  return (
    <div className={styles.imagenViewContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.displayArea}>
        <ImageDisplay
          images={resultImages}
          filteredReason={filteredReason}
          isLoading={isLoading}
        />
      </div>
      <div className={styles.inputAreaContainer}>
        <PromptInput
          prompt={currentPrompt}
          onPromptChange={setCurrentPrompt}
          onSubmit={handleImageGenerationSubmit}
          isLoading={isLoading}
          placeholder="Enter a prompt to generate images..."
          suggestions={suggestions}
          onSuggestionClick={handleSuggestion}
          aiInstance={aiInstance}
          activeMode="imagenGen"
          selectedFile={null} // Imagen does not use file uploads in this sample
          onCancel={handleCancel}
          currentImagenParams={currentParams} // Pass imagen params for completeness, though not used by PromptInput internally
        />
      </div>
    </div>
  );
};

export default ImagenView;
