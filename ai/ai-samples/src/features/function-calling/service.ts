import { FunctionDeclarationsTool, Schema } from 'firebase/ai';
import { getAiModel } from '../../services/firebaseAIService';

export interface FunctionCallingResult {
    functionCalls?: {
        name: string;
        args: Record<string, any>;
        result: Record<string, any>
    }[];
    finalText: string;
}
/**
 * Step 1: Write the local function.
 * This interacts with your internal/external API or service.
 */

// This function calls a hypothetical external API that returns
// a collection of weather information for a given location on a given date.
// `location` is an object of the form { city: string, state: string }
async function fetchWeather({ location, date }: { location: { city: string; state: string }; date: string }) {
    // TODO(developer): Write a standard function that would call to an external weather API.
    console.log(`Fetching mock weather for ${location.city}, ${location.state} on ${date}`);

    // For demo purposes, this hypothetical response is hardcoded here in the expected format.
    return {
        temperature: 38,
        chancePrecipitation: '56%',
        cloudConditions: 'partlyCloudy',
    };
}

/**
 * Step 2: Create a function declaration.
 * This defines the schema and description that Gemini uses to decide when to call the tool.
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
        },
    ],
};

/**
 * Steps 3-5: Execute the function calling round-trip.
 */
export async function executeFunctionCalling(prompt: string): Promise<FunctionCallingResult> {
    // Step 3: Provide the function declaration during model initialization.
    const model = getAiModel('gemini-3.1-flash-lite', {
        tools: [fetchWeatherTool],
    });

    const chat = model.startChat();

    // Step 4: Call the function to invoke the external API.
    // Send the user's question (the prompt) to the model using multi-turn chat.
    let result = await chat.sendMessage(prompt);
    const functionCalls = result.response.functionCalls() ?? [];

    const resolvedCalls: { name: string; args: any; result: any }[] = [];

    // When the model responds with one or more function calls, invoke the function(s).
    if (functionCalls.length > 0) {
        for (const call of functionCalls) {
            if (call.name === 'fetchWeather') {
                try {
                    const weatherResult = await fetchWeather(call.args as { location: { city: string; state: string }; date: string });
                    resolvedCalls.push({ name: call.name, args: call.args, result: weatherResult });
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Unknown error occured';
                    resolvedCalls.push({
                        name: call.name, args: call.args, result: {error: message}
                    });
                }
            }
        }
    }

    /**
    * Step 5: Send the response from the function back to the model
    * so that the model can use it to generate its final response.
    */
    if (resolvedCalls.length > 0) {
        result = await chat.sendMessage(
            resolvedCalls.map(c => ({
                functionResponse: { name: c.name, response: c.result },
            }))

        );

    }

    const finalText = result.response.text();

    return {
        functionCalls: resolvedCalls, finalText,
    };
}