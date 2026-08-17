import { FunctionDeclarationsTool, Schema } from 'firebase/ai';
import { getAiModel } from '../../services/firebaseAIService';

/**
 * Step 1: Write the local function.
 */
async function fetchWeather({ location, date }: { location: { city: string; state: string }; date: string }) {
    console.log(`[Automatic Execution] Fetching weather for ${location.city}, ${location.state} on ${date}`);
    // TODO(developer): Write a standard function that would call to an external weather API.
    return {
        temperature: 38,
        chancePrecipitation: '56%',
        cloudConditions: 'partlyCloudy',
    };
}

/**
 * Step 2: Create a function declaration.
 * 
 * Note: By simply attaching the `functionReference` property to 
 * our standard declaration, we upgrade this from a manual tool to an 
 * Automatic Function Call.
 */
const fetchWeatherTool: FunctionDeclarationsTool = {
    functionDeclarations: [
        {
            name: 'fetchWeather',
            description: 'Get the weather conditions for a specific city on a specific date',
            parameters: Schema.object({
                properties: {
                    location: Schema.object({
                        description: 'The name of the city and its state for which to get the weather. Only cities in the USA are supported.',
                        properties: {
                            city: Schema.string({ description: 'The city of the location.' }),
                            state: Schema.string({ description: 'The US state of the location.' }),
                        },
                    }),
                    date: Schema.string({
                        description: 'The date for which to get the weather. Date must be in the format: YYYY-MM-DD.',
                    }),
                },
            }),
            functionReference: fetchWeather,
        },
    ],
};

/**
 * Step 3: Execute the prompt.
 */
export async function executeAutomaticFunctionCalling(prompt: string): Promise<string> {
    try {
        const model = getAiModel('gemini-3.5-flash', {
            tools: [fetchWeatherTool],
        });
        const chat = model.startChat();
        const result = await chat.sendMessage(prompt);

        return result.response.text();
    } catch (error) {
        console.error('Error during automatic function calling:', error);
        throw error;
    }
}