import { getAiModel } from '../../services/firebaseAIService';
import { GroundingMetadata } from 'firebase/ai';

export interface GroundedResult {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

/**
 * Generates grounded content using the Google Search tool.
 * Connects the Gemini model to real-time web content for up-to-date answers,
 * sources (groundingChunks), and compliant search suggestions (searchEntryPoint).
 * @param prompt The string question or instruction sent to the model.
 * @returns The text response and grounding metadata.
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
      : new Error('An unknown error occurred during generation.');
  }
}