import React, { useState, useCallback } from "react";
import {
  getGenerativeModel,
  ModelParams,
  AI,
  AIError,
} from "firebase/ai";
import PromptInput from "../components/Common/PromptInput";
import styles from "./NanoBananaView.module.css";

// Component to display generated content (text and/or images)
type GeneratedContentPart = {
  text?: string;
  image?: {
    mimeType: string;
    bytesBase64Encoded: string;
  };
};

const ContentDisplay: React.FC<{
  parts: GeneratedContentPart[];
  filteredReason?: string;
  isLoading: boolean;
}> = ({ parts, filteredReason, isLoading }) => {
  return (
    <div className={styles.imageDisplayContainer}>
      {isLoading && <div className={styles.loading}>Generating content...</div>}
      {!isLoading && parts.length === 0 && !filteredReason && (
        <div className={styles.placeholder}>
          Generated content will appear here.
        </div>
      )}
      {filteredReason && (
        <div className={styles.filteredReason}>Filtered: {filteredReason}</div>
      )}
      <div className={styles.contentList}>
        {parts.map((part, index) => (
          <div key={index} className={styles.partWrapper}>
            {part.text && <p className={styles.generatedText}>{part.text}</p>}
            {part.image && (
              <div className={styles.imageWrapper}>
                <img
                  src={`data:${part.image.mimeType};base64,${part.image.bytesBase64Encoded}`}
                  alt={`Generated content ${index + 1}`}
                  className={styles.generatedImage}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface NanoBananaViewProps {
  currentParams: ModelParams;
  aiInstance: AI;
  selectedAspectRatio?: string;
}

/**
 * View component for interacting with the Nano Banana model to generate images (and text).
 */
const NanoBananaView: React.FC<NanoBananaViewProps> = ({
  currentParams,
  aiInstance,
  selectedAspectRatio,
}) => {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentPart[]>([]);
  const [filteredReason, setFilteredReason] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  const handleImageGenerationSubmit = useCallback(async () => {
    if (!currentPrompt.trim() || isLoading) {
      return;
    }

    const promptText = currentPrompt.trim();
    const finalPromptText = selectedAspectRatio
      ? `${promptText}\nUse aspect ratio ${selectedAspectRatio}`
      : promptText;

    console.log(
      `[NanoBananaView] Starting generation for prompt: "${finalPromptText}" with params:`,
      currentParams,
    );
    setIsLoading(true);
    setGeneratedContent([]); // Clear previous results
    setFilteredReason(undefined);
    setError(null);

    try {
      console.log(`[NanoBananaView] Using Generative model for interleaved content`);
      const model = getGenerativeModel(aiInstance, {
        model: currentParams.model,
        generationConfig: currentParams.generationConfig,
      });

      const result = await model.generateContent(finalPromptText);
      console.log("[NanoBananaView] Generation successful.", result);
      
      const response = result.response;
      const parts: GeneratedContentPart[] = [];
      
      // Intentionally only support handling the primary candidate.
      if (response.candidates?.[0].content?.parts) {
        for (const part of response.candidates?.[0].content?.parts) {
          if (part.type === "text" && part.text) {
            parts.push({ text: part.text });
          }
          if (part.type === "inlineData" && part.inlineData) {
            parts.push({
              image: {
                mimeType: part.inlineData.mimeType,
                bytesBase64Encoded: part.inlineData.data,
              },
            });
          }
        }
      }

      const candidate = response.candidates?.[0];
      if (candidate && candidate.finishReason && candidate.finishReason !== "STOP") {
        setFilteredReason(`Generation stopped due to: ${candidate.finishReason}`);
      }

      if (response.promptFeedback) {
        setFilteredReason(response.promptFeedback.blockReason ? `Prompt blocked due to: ${response.promptFeedback.blockReason}` : "Prompt blocked due to safety or policy reasons.");
      }

      setGeneratedContent(parts);
    } catch (err: unknown) {
      console.error("[NanoBananaView] Error during generation:", err);
      if (err instanceof AIError) {
        const message =
          err.message || "Failed to generate content due to an unknown error.";
        const details = err.customErrorData?.errorDetails
          ? ` Details: ${JSON.stringify(err.customErrorData.errorDetails)}`
          : "";
        setError(`Error: ${message}${details}`);
      } else {
        setError("Failed to generate content due to an unknown error.");
      }
      setGeneratedContent([]);
    } finally {
      setIsLoading(false);
      setCurrentPrompt("");
    }
  }, [currentPrompt, isLoading, currentParams, aiInstance, selectedAspectRatio]);

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
    <div className={styles.nanoBananaViewContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.displayArea}>
        <ContentDisplay
          parts={generatedContent}
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
          activeMode="nanobanana"
          selectedFile={null}
          selectedAspectRatio={selectedAspectRatio}
        />
      </div>
    </div>
  );
};

export default NanoBananaView;
