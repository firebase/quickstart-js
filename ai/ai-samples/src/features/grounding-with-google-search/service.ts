import { getAiModel } from '../../services/firebaseAIService';
import { GroundingMetadata } from 'firebase/ai';

export interface GroundedResult {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

/**
 * Generates a grounded response using Google Search as a tool.
 * Connects the Gemini model to real-time web content for up-to-date answers and citations.
 * @param prompt The string question or instruction sent to the model.
 * @returns The text response and grounding metadata (queries, sources, search suggestions).
 */
export async function generateGroundedContent(prompt: string): Promise<GroundedResult> {
  try {
    const model = getAiModel('gemini-3.7-flash', {
      tools: [{ googleSearch: {} }],
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const groundingMetadata = result.response.candidates?.[0]?.groundingMetadata;

    return { text, groundingMetadata };
  } catch (error: unknown) {
    console.error('Error generating grounded content with Firebase AI:', error);
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred during grounded content generation.');
  }
}

/**
 * Streams a grounded response from the model, yielding text chunks as they arrive.
 * Resolves with the final GroundingMetadata once the stream completes.
 * @param prompt The string question or instruction sent to the model.
 * @param onChunk Callback fired for each non-empty text chunk.
 * @returns The grounding metadata from the final response candidate.
 */
export async function streamGroundedContent(
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<GroundingMetadata | undefined> {
  try {
    const model = getAiModel('gemini-3.7-flash', {
      tools: [{ googleSearch: {} }],
    });

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }

    const response = await result.response;
    return response.candidates?.[0]?.groundingMetadata;
  } catch (error: unknown) {
    console.error('Error streaming grounded content with Firebase AI:', error);
    throw error instanceof Error
      ? error
      : new Error('An unknown error occurred during grounded streaming.');
  }
}