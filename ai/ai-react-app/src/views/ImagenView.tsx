import React, { useState, useCallback } from "react";
import {
  getImagenModel,
  ImagenModelParams,
  ImagenInlineImage,
  ImagenGenerationResponse,
  AI,
  AIError,
} from "firebase/ai";
import PromptInput from "../components/Common/PromptInput";
import styles from "./ImagenView.module.css";

// Simple component to display generated images or placeholders/loading states.
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

/**
 * View component for interacting with the Imagen model to generate images.
 */
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
    setResultImages([]); // Clear previous results
    setFilteredReason(undefined);
    setError(null);

    try {
      const imagenModel = getImagenModel(aiInstance, currentParams);
      console.log(`[ImagenView] Using Imagen model: ${imagenModel.model}`);

      const result: ImagenGenerationResponse<ImagenInlineImage> =
        await imagenModel.generateImages(promptText);

      console.log("[ImagenView] Image generation successful.", result);
      setResultImages(result.images);
      setFilteredReason(result.filteredReason);
    } catch (err: unknown) {
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
      setResultImages([]);
    } finally {
      setIsLoading(false);
      setCurrentPrompt("");
    }
  }, [currentPrompt, isLoading, currentParams, aiInstance]);

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
          selectedFile={null}
        />
      </div>
    </div>
  );
};

export default ImagenView;
