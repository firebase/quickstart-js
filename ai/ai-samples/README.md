# Firebase AI Samples

A modular migration of the Firebase AI logic, demonstrating different capabilities:

## Samples

You can open this sample as a Node/React project and run it in your local browser. When doing so, you need to add this sample app to a Firebase project on the Firebase console. You can add multiple sample apps to the same Firebase project; no need to create separate projects for each app.

This repository demonstrates the following capabilities:
* Text Generation
* Chat
* Multimodal
* Structured Output
* Function Calling
* Automatic Function Calling
* Image Generation
* Video Analysis

## Setup & Configuration

To connect this sample app to your Firebase project, register a new Web App in your Firebase Console to generate your Firebase configuration object.

1. Navigate to this directory and install dependencies:
   ```bash
   npm install
   ```

2. Add your Firebase config

Go to console.firebase.google.com and follow the Firebase AI Logic guided setup to enable the API and choose your gemini API provider. 
Copy the example config file and fill in your project values. Open src/config/firebase-config.ts and replace the placeholder values with your firebase project config (found in Project Settings -> your apps)


3. Running the samples

For a full app experience to browse all features:
```bash
npm run dev
```

To run individual features in isolated mode, run the single feature directly without the app shell using one of these scripts:

```bash
npm run dev:text          # Text Generation
npm run dev:chat          # Chat
npm run dev:multimodal    # Multimodal
npm run dev:structured    # Structured Output
npm run dev:function      # Function Calling
npm run dev:auto-function # Automatic Function Calling
npm run dev:image         # Image Generation
npm run dev:video         # Video Analysis
```

After running any of the above commands, open your browser to http://localhost:*** (provided in the console)

## Copy service.ts for platform agnostic use

All AI logic is decoupled from the React UI. If you want to use these features in your own project, navigate to any src/features/*/service.ts file. These files are framework-agnostic and can be safely copy-pasted into any JavaScript or TypeScript web project.

## App Check 

App check protects your API Key from unauthorized use. It is not required to run the samples locally but highly recommended before deploying to production. 

Debug token: 
firebaseAIService.ts includes App Check initialization for local development. To enable it:

1. Set VITE_APPCHECK_DEBUG_TOKEN=true in your .env.local file
2. On the first run, a debug token will be printed in the browser console.
3. Copy that token and register it in the Firebase Console under
App Check -> Apps -> your apps -> Debug Token

Production setup:
For production, use reCAPTCHA v3 as the App Check provider:

1. Go to the Firebase Console -> App Check -> Register your app
2. Choose reCaptcha v3 and follow the setup steps
3. Add your reCaptcha site key to firebase-config.ts 

See the [App Check Docs](https://firebase.google.com/docs/app-check/web/recaptcha-provider) for full instructions.