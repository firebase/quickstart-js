# Firebase Data Connect Quickstart

## Introduction

This is a sample app for the preview version of Firebase DataConnect. This service is currently in Public Preview at no cost for a limited time.

## Getting Started with Firebase DataConnect

Follow these steps to get up and running with Firebase DataConnect. For more detailed instructions, check out the [official documentation](https://firebase.google.com/docs/data-connect/quickstart).

### 1. Create a New Data Connect Service and Cloud SQL Instance

1. Open [Firebase Data Connect](https://console.firebase.google.com/u/0/project/_/dataconnect) in your Firebase Console project and select **Get Started**.
2. Create a new Data Connect service and a Cloud SQL instance. Ensure the Blaze plan is active. Find pricing details at [Firebase Pricing](https://firebase.google.com/pricing).
3. Choose your server region. If you plan to use vector search, select `us-central1`.
4. Wait for the Cloud SQL instance to be provisioned. Once it's ready, you can manage it in the [Cloud Console](https://console.cloud.google.com/sql).

### 2. Set Up Firebase CLI

Ensure the Firebase CLI is installed and up to date:

```bash
npm install -g firebase-tools
```

### 3. Cloning the Repository

This repository contains the quickstart to help you explore the functionalities of DataConnect.

1. Clone this repository to your local machine.
2. Navigate to the `dataconnect` folder and initialize your Firebase project:

    ```bash
    cd ./dataconnect
    ```

   *(Optional)*: If you plan to use other Firebase features, run `firebase init` instead, and select both DataConnect options as well as any additional feature you want to use.

### 4. Installing VS Code Extension

1. Install [VS Code](https://code.visualstudio.com/).
2. Download and install the [Firebase DataConnect extension](https://marketplace.visualstudio.com/items?itemName=GoogleCloudTools.firebase-dataconnect-vscode).
3. Open this quickstart in VS Code and log in to your Firebase account using the Firebase extension.
4. In the Firebase DataConnect VSCode extension, click **Start Emulators** and confirm that the emulators are running in the terminal.

### 5. Populating the Database

1. In VS Code, open `dataconnect/movie_insert.gql`. Ensure the emulators in the Firebase DataConnect extension are running.
2. You should see a **Run (local)** button at the top of the file. Click this to insert mock movie data into your database.
3. Check the DataConnect Execution terminal to confirm that the data was added successfully.

### 6. Running the App

1. Navigate to the `app` folder and install dependencies:

    ```bash
    cd ./app
    npm install
    ```

2. Start the app:

    ```bash
    npm run dev
    ```

### 7. Deployment

1. Create a Web App in the [Firebase Console](https://console.firebase.google.com) and take note of your App ID.
2. In the Firebase Console, click on **Add App**. You can ignore the SDK setup for now, but note the generated `firebaseConfig` object.
3. Replace the `firebaseConfig` in `app/src/lib/firebase.tsx`:

    ```javascript
    const firebaseConfig = {
      apiKey: "API_KEY",
      authDomain: "PROJECT_ID.firebaseapp.com",
      projectId: "PROJECT_ID",
      storageBucket: "PROJECT_ID.appspot.com",
      messagingSenderId: "SENDER_ID",
      appId: "APP_ID"
    };
    ```

4. Build the web app for hosting deployment:

    ```bash
    cd ./app
    npm run build
    ```

5. Allow domains for Firebase Auth in your [project console](https://console.firebase.google.com/project/_/authentication/settings) (e.g., `http://127.0.0.1`).
6. In `dataconnect/dataconnect.yaml`, ensure that your `instanceId`, `database`, and `serviceId` match your project configuration:

    ```yaml
    specVersion: "v1alpha"
    serviceId: "your-service-id"
    location: "us-central1"
    schema:
      source: "./schema"
      datasource:
        postgresql:
          database: "your-database-id"
          cloudSql:
            instanceId: "your-instance-id"
    connectorDirs: ["./movie-connector"]
    ```

7. Deploy your project:

    ```bash
    npm install -g firebase-tools
    firebase login --reauth
    firebase use --add
    firebase deploy --only dataconnect,hosting
    ```

8. To compare schema changes, run:

    ```bash
    firebase dataconnect:sql:diff
    ```

9. If the changes are acceptable, apply them with:

    ```bash
    firebase dataconnect:sql:migrate
    ```

## License

© Google, 2024. Licensed under an [Apache-2](../../LICENSE) license.
