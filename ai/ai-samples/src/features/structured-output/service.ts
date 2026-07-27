import { Schema } from 'firebase/ai';
import { getAiModel } from '../../services/firebaseAIService';

/**
 * Define the Schema using the SDK's built-in Schema classes.
 * This explicitly tells Gemini exactly what the returned JSON object must look like.
 */
const characterSchema = Schema.object({
    properties: {
        characters: Schema.array({
            items: Schema.object({
                properties: {
                    name: Schema.string(),
                    accessory: Schema.string(),
                    age: Schema.number(),
                    species: Schema.string(),
                },
                // Note: In the Firebase AI Logic SDK, all fields are required by default.
                // You must explicitly pass an array of properties that the model can skip.
                // For more information, see official Firebase documentation:
                // https://firebase.google.com/docs/ai-logic/generate-structured-output?api=dev
                optionalProperties: ["accessory"],
            }),
        }),
    }
});

/**
 * Define an enum schema object using the SDK.
 * This restricts the model to only return one of these specific predefined string values.
 */
const genreEnumSchema = Schema.enumString({
    enum: ["drama", "comedy", "documentary"],
});


/**
 * Generate the structured JSON output.
 * @param prompt The string instruction (e.g., "Generate 3 animal-based characters for a card game").
 * @returns A perfectly formatted JSON string matching the characterSchema.
 */
export async function generateWithSDKSchema(prompt: string): Promise<string> {
    try {
        const model = getAiModel('gemini-3.5-flash', {
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: characterSchema
            }
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating structured JSON with Firebase AI:', error);
        throw error;
    }

}

/**
 * Generate the enum values output.
 * @param prompt The string instruction (e.g., "The film aims to educate...").
 * @returns A plain-text enum value that the model selects from the defined schema.
 */
export async function generateWithEnumValues(prompt: string): Promise<string> {
    try {
        const model = getAiModel('gemini-3.5-flash', {
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: genreEnumSchema
            }
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating enum values with Firebase AI:', error);
        throw error;
    }
}

