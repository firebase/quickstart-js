import { initializeApp} from 'firebase/app';
import { getAI, getGenerativeModel } from 'firebase/ai';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
//This file is Vite specific.
//If using a different environment, adjust as needed.

const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG 
  ? JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG) 
  : {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

const app = initializeApp(firebaseConfig);

// This shield prevents fatal ReferenceErrors if this file is executed 
// in a Server-Side Rendering (SSR) environment like Node.js or Next.js.
if (typeof window !== 'undefined'){
  // initialize app check with debug token 
  (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  initializeAppCheck(app, {
  // The string here doesn't matter in this specific case, as setting 
  // FIREBASE_APPCHECK_DEBUG_TOKEN above means it will be ignored. 
  // However, in production, this MUST be a valid reCAPTCHA site key.
    provider: new ReCaptchaEnterpriseProvider('YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true
  });
}

const ai = getAI(app);

export const getAiModel = (modelName: string = 'gemini-3.5-flash', additionalConfig: Record<string, any> = {}) => {
  return getGenerativeModel(ai, { model: modelName, ...additionalConfig });
}