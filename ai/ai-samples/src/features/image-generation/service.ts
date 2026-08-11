import { ChatSession, ImageConfigAspectRatio, ImageConfigImageSize, Part, ResponseModality } from 'firebase/ai';
import { getAiModel } from '../../services/firebaseAIService';

export type ImageGenerationSegment =
  | { type: 'text'; text: string }
  | { type: 'image'; mimeType: string; base64: string };
export interface ImageGenerationResult {
  segments: ImageGenerationSegment[];
}

/**
 * Helper: Safely extracts text and image Base64 data from a response parts array.
 * Iterates over all parts and capturing everything.
 */
function extractTextAndImages(parts: Part[] = []): ImageGenerationResult {
  const segments: ImageGenerationSegment[] = [];

  for (const part of parts) {
    if (part.text) {
      segments.push({ type: 'text', text: part.text });
    }
    if (part.inlineData) {
      segments.push({
        type: 'image',
        mimeType: part.inlineData.mimeType,
        base64: part.inlineData.data
      });
    }
  }

  return { segments };
}

/**
 * Helper: Converts a standard browser File object into a Firebase AI SDK Part.
 * Uses the native browser FileReader API to extract the Base64 string.
 */

export async function fileToGenerativePart(file: File): Promise<Part> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        if (base64Data) {
          resolve({
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          });
        } else {
          reject(new Error("Failed to extract Base64 data from file."));
        }
      } else {
        reject(new Error("Failed to parse file data as Base64."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Concept 1 & 5: Generate Images (Text-Only Input) + Image Configuration
 * Demonstrates unary text-to-image generation, injecting custom aspect ratio and size parameters.
 */
export async function generateImage(
  prompt: string,
  aspectRatio: ImageConfigAspectRatio = ImageConfigAspectRatio.SQUARE_1x1,
  imageSize: ImageConfigImageSize = ImageConfigImageSize.SIZE_1K
): Promise<ImageGenerationResult> {
  const model = getAiModel('gemini-3.1-flash-lite-image', {
    generationConfig: {
      responseModalities: [ResponseModality.IMAGE],
      imageConfig: { aspectRatio, imageSize }
    }
  });

  const result = await model.generateContent(prompt);
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  return extractTextAndImages(parts);
}

/**
 * Concept 2: Generate Interleaved Images and Text
 * Demonstrates instructing the model to return both text blocks and images in a single unary response.
 */
export async function generateInterleavedContent(prompt: string): Promise<ImageGenerationResult> {
  const model = getAiModel('gemini-3.1-flash-lite-image', {
    generationConfig: {
      responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE]
    }
  });

  const result = await model.generateContent(prompt);
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  return extractTextAndImages(parts);
}

/**
 * Concept 3: Edit Images (Text-and-Image Input)
 * Demonstrates unary multimodal prompting where you pass a reference image and a text instruction.
 */
export async function editSingleImage(prompt: string, file: File): Promise<ImageGenerationResult> {
  const imagePart = await fileToGenerativePart(file);
  const model = getAiModel('gemini-3.1-flash-lite-image', {
    generationConfig: {
      responseModalities: [ResponseModality.IMAGE]
    }
  });

  const result = await model.generateContent([prompt, imagePart]);
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  return extractTextAndImages(parts);
}

/**
 * Concept 4: Iterate and Edit Images Using Multi-Turn Chat
 * Initializes a stateful chat session specifically for iterative visual editing.
 */
export function startImageChat(aspectRatio: ImageConfigAspectRatio = ImageConfigAspectRatio.SQUARE_1x1): ChatSession {
  const model = getAiModel('gemini-3.1-flash-lite-image', {
    generationConfig: {
      responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE],
      imageConfig: { aspectRatio }
    }
  });

  return model.startChat({ history: [] });
}

/**
 * Sends a message to the active image chat session.
 * For the initial turn, you can pass a reference file. Follow-up turns can omit the file 
 * and rely purely on the ChatSession history.
 * Note: The SDK's ChatSession automatically appends prompts and responses to the history array behind the scenes. 
 * For long iterative image sessions, generated base64 image strings will accumulate in memory.
 */
export async function sendImageChatMessage(
  chat: ChatSession,
  prompt: string,
  file?: File
): Promise<ImageGenerationResult> {
  const messagePayload: (string | Part)[] = [prompt];
  if (file) {
    messagePayload.push(await fileToGenerativePart(file));
  }

  const result = await chat.sendMessage(messagePayload);
  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  return extractTextAndImages(parts);
}