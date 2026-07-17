import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAI, getGenerativeModel } from 'firebase/ai';
// Import App Check if you haven't already
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// initialize app check with debug token 
if (typeof window !== 'undefined') {
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
};