import { initializeApp, FirebaseApp } from "firebase/app";
import {
  HarmCategory,
  HarmBlockThreshold,
  Schema,
  FunctionDeclaration,
  Part,
  Content,
  CountTokensResponse,
  GenerativeModel,
  ModelParams,
  ImagenModelParams,
  FunctionCall,
  GoogleSearchTool,
  BackendType,
} from "firebase/ai";

import { firebaseConfig } from "../config/firebase-config";

export const AVAILABLE_GENERATIVE_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-exp",
  "gemini-2.5-flash"
];
export const AVAILABLE_IMAGEN_MODELS = [
  "imagen-4.0-generate-001",
  "imagen-4.0-fast-generate-001",
  "imagen-4.0-ultra-generate-001"
];
export const LIVE_MODELS = new Map<BackendType, string>([
  [BackendType.GOOGLE_AI, 'gemini-2.5-flash-native-audio-preview-09-2025'],
  [BackendType.VERTEX_AI, 'gemini-live-2.5-flash-preview-native-audio-09-2025']
])

let app: FirebaseApp;
try {
  if (firebaseConfig.apiKey === "YOUR_API_KEY" || !firebaseConfig.projectId) {
    console.error(
      "Firebase config uses placeholder values. Update src/config/firebase-config.ts.",
    );
  }
  app = initializeApp(firebaseConfig);
  console.log("Firebase App Initialized.");
} catch (error) {
  console.error("Error initializing Firebase App:", error);
  throw new Error("Firebase initialization failed.");
}

export const defaultFunctionCallingTool = {
  functionDeclarations: [
    {
      name: "getCurrentWeather",
      description: "Get the current weather in a given location",
      parameters: Schema.object({
        properties: {
          location: Schema.string({
            description: "The city and state, e.g. San Francisco, CA",
          }),
          unit: Schema.enumString({
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit",
          }),
        },
        required: ["location"],
      }),
    } as FunctionDeclaration,
  ],
};

export const defaultGoogleSearchTool: GoogleSearchTool = {
  googleSearch: {}
}

export const defaultGenerativeParams: Omit<ModelParams, "model"> = {
  // Model name itself is selected in the UI
  generationConfig: {
    temperature: 0.9,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  // tools, toolConfig, systemInstruction default to undefined
};

export const defaultImagenParams: Omit<ImagenModelParams, "model"> = {
  // Model name selected in UI
  generationConfig: {
    numberOfImages: 1,
  },
  // Default all safety settings to undefined
};

/**
 * Mock function call
 */
export const handleFunctionExecution = async (
  functionCall: FunctionCall,
): Promise<object> => {
  console.log(
    `[Service] Executing function: ${functionCall.name}, Args:`,
    functionCall.args,
  );
  if (functionCall.name === "getCurrentWeather") {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
    const location: string =
      "location" in functionCall.args &&
        typeof functionCall.args.location === "string"
        ? functionCall.args.location
        : "Default City, ST";
    const unit: string =
      "unit" in functionCall.args && typeof functionCall.args.unit === "string"
        ? functionCall.args.unit
        : "celsius";
    const temp =
      unit === "celsius"
        ? Math.floor(Math.random() * 30 + 5)
        : Math.floor(Math.random() * 50 + 40);
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      weather: { location, temperature: temp, unit, condition },
    };
  }
  console.warn(`[Service] Unknown function called: ${name}`);
  return { error: `Function ${name} not implemented.` };
};

export const countTokensInPrompt = async (
  modelInstance: GenerativeModel,
  parts: Part[],
  history: Content[] = [],
  params?: {
    systemInstruction?: ModelParams["systemInstruction"];
    tools?: ModelParams["tools"];
  },
): Promise<CountTokensResponse> => {
  const contents: Content[] = [...history];
  if (parts.length > 0) {
    contents.push({ role: "user", parts });
  }

  const request = {
    contents,
    systemInstruction: params?.systemInstruction,
    tools: params?.tools,
  };

  console.log("[Service] Counting tokens for request:", request);
  try {
    const result = await modelInstance.countTokens(request);
    console.log("[Service] Token count result:", result);
    return result;
  } catch (error) {
    console.error("[Service] Error counting tokens:", error);
    throw error;
  }
};

export { app };