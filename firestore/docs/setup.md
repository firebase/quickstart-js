# Setup

This document provides step-by-step instructions for setting up the Friendly Eats application for local development.

## Prerequisites

*   [Node.js](https://nodejs.org/en/download) (version 16.0 or higher)
*   [Java](https://jdk.java.net/) (JDK version 11 or higher)
*   [Angular CLI](https://angular.io/cli)
*   [Firebase CLI](https://firebase.google.com/docs/cli)

To install the CLIs globally, run the following commands:

```bash
npm install -g @angular/cli
npm install -g firebase-tools
```

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/firebase/quickstart-js.git
    cd quickstart-js/firestore
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    (cd functions && npm install)
    (cd scripts && npm install)
    ```

## Configuration

1.  **Configure Firebase:**

    The application can be run against the Firebase Local Emulator Suite or a production Firebase project.

    *   **Emulator Suite:** No configuration is needed. The necessary settings are in `src/environments/environment.default.ts`.

    *   **Production Project:**

        1.  Create a Firebase project in the [Firebase Console](https://console.firebase.google.com).
        2.  Copy the `firebaseConfig` object from your project settings.
        3.  Paste the `firebaseConfig` object into `src/environments/environment.prod.ts`.

## Running the Application

1.  **Run the application:**

    *   **With emulators:**

        ```bash
        npm start
        ```
        This command will start the Firebase Emulator Suite and the Angular development server. The emulators are automatically populated with data from the `app-data-seed` directory on startup.

    *   **Against a production project:**

        ```bash
        npm run production
        ```

2.  **View the application:**

    Open your browser and navigate to `http://localhost:4200`.

3.  **Populating the database (optional):**

    If you need to add more mock data to your database, you can use the following commands:

    *   **For emulators:**
        ```bash
        npm run populate-emulators
        ```

    *   **For a production project:**
        ```bash
        npm run populate-production
        ```
