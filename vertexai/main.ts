/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { initializeApp } from 'firebase/app';
import { firebaseConfig, RECAPTCHA_ENTERPRISE_SITE_KEY } from './config';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";

async function main() {
  const app = initializeApp(firebaseConfig);

  // Initialize App Check
  // This line can be removed if you do not want to enable App Check for
  // your project. App Check is recommended to limit unauthorized usage.
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
  });

  // Get VertexAI instance
  const vertexAI = getVertexAI(app);
  // Get a Gemini model
  const model = getGenerativeModel(
    vertexAI,
    { model: "gemini-1.5-flash-preview-0514" }
  );
  // Call generateContent with a string or Content(s)
  const generateContentResult = await model.generateContent("what is a cat?");
  console.log(generateContentResult.response.text());
}

main();
