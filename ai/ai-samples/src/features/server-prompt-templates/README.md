# Firebase AI Logic: Server Prompt Templates Sample

This quickstart demonstrates how to fetch and execute centrally managed prompt templates stored in the Firebase Console using the Firebase AI Logic SDK.

## Why Server Prompt Templates?

- **No deployment updates**: Change prompts, tune system instructions, or switch underlying models directly in the Firebase Console without having to release a new app version.
- **Security**: Protect against exposing your prompt client-side.

---

## 1. Firebase Console Setup

Before running this sample, create and lock the template in your Firebase project:

1. Open the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. In the left navigation, navigate to **AI Logic > Prompt Templates**.
3. Click **Create Template**. Note that these starter templates provide the format and syntax for some common use cases and this tutorial assumes you've selected the `Input + System Instructions` option. Once you clicked that, configure the following:
   - **Template ID**: `invoice-generator`
   - **Model**: `gemini-3.5-flash-lite` (or any available Gemini model)
4. In the **Prompt Content** / **System Instructions** text area, paste the following prompt:
   ```text
   {{role "system"}}
    All output must be a clearly structured invoice document.
    Use a tabular or clearly delineated list format for line items.

    {{role "user"}}
    Create an example customer invoice for a customer named {{customerName}}.
   ```
5. Click **Save**.
6. **Important**: While client applications can execute both unlocked (draft) and locked templates during development, you should always **Lock** your template before deploying to production. Locking freezes the prompt configuration, ensuring that subsequent console edits do not accidentally change your production app's behavior.

---

## 2. Running the Sample Locally

Run the sample inside the full app shell:
```bash
npm run dev
```

Or run this feature directly in isolated mode:
```bash
npm run dev:template
```

Open your browser to the local URL (e.g., `http://localhost:***` provided in the console).

---

## 3. Using in Your Own Project

To use Server Prompt Templates in your project:

```ts
import { getAI, getTemplateGenerativeModel } from 'firebase/ai';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const ai = getAI(app);
const model = getTemplateGenerativeModel(ai);
const result = await model.generateContent('invoice-generator', {
  customerName: 'Jane Doe',
});
console.log(result.response.text());
```

---

## 4. Possible Troubleshooting & Failure Surfaces

| Issue | Cause | Resolution |
|---|---|---|
| `NOT_FOUND` / 404 | Template ID mismatch or template doesn't exist in the active Firebase project | Verify that the template ID in your code is exactly `invoice-generator` and that you are initialized in the correct Firebase Project |
| Missing Variable output | Variable names in client code don't match console | Ensure the keys passed to `templateVariables` match the `{{variable}}` placeholders in your prompt template. |
| `PERMISSION_DENIED` | Firebase AI Logic API not enabled or App Check blocked | Follow the Firebase AI Logic guided setup in the console and ensure your API key / App Check tokens are valid. |