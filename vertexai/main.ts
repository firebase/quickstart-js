import { initializeApp } from 'firebase/app';
import { firebaseConfig, RECAPTCHA_ENTERPRISE_SITE_KEY } from './config';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

async function main() {
  const app = initializeApp(firebaseConfig);

  // initialize app check
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
  });

  // Get vertex instance
  const vertexAI = getVertexAI(app);
  // Get a gemini model
  const model = getGenerativeModel(
    vertexAI,
    { model: "gemini-1.0-pro" }
  );
  // Call generateContent with a string or Content(s)
  const generateContentResult = await model.generateContent("what is a cat?");
  console.log(generateContentResult.response.text());
}

main();
