Firebase DataConnect Quickstart
=======================================

Introduction
------------

This is a sample app for the preview version of the Firebase DataConnect.
This service is currently in Private Preview at no cost for a limited time. Sign up for the program at [Firebase Data Connect](https://firebase.google.com/products/data-connect).
This quickstart will not work if you don't have access to the preview.

<!-- Introduction
------------

[Read more about Firebase DataConnect ](https://firebase.google.com/docs/dataconnect/) -->

#  Getting Started with Firebase Data Connect
---------------
Follow these steps to get up and running with Firebase Data Connect. For more detailed instructions, check out the [official documentation](https://firebase.google.com/docs/data-connect/quickstart).

### 1. Create a New Data Connect Service and Cloud SQL Instance

1. Open [Firebase Data Connect](https://console.firebase.google.com/u/0/project/_/dataconnect) in your project in Firebase Console and select Get Started.
2. Create a new Data Connect service and a Cloud SQL instance. Ensure the Blaze plan is active. Pricing details can be found at [Firebase Pricing](https://firebase.google.com/pricing).
3. Select your server region, if you wish to use vector search, make sure to select `us-central1` region.
4. Allow some time for the Cloud SQL instance to be provisioned. After it's provisioned, the instance can be managed in the [Cloud Console](https://pantheon.corp.google.com/sql).

### 2. Set Up Firebase CLI

Ensure the Firebase CLI is installed and up to date:

```bash
npm install -g firebase-tools
```

### 3. Cloning the repository
This repository contains the quickstart to get started with the functionalities of Data Connect.

1. Clone this repository to your local machine.
2. cd to the `dataconnect` folder, and initialize your Firebase project with `firebase init dataconnect`. Overwrite only dataconnect.yaml when prompted, do not overwrite any other dataconnect files.
(Optional): If you intend on using other Firebase features, run `firebase init` instead, and select both DataConnect options as well as any feature you intend to use.
3. Replace variables in `.env` with your project-specific values.
4. Allow domains for Firebase Auth in your [project console](https://console.firebase.google.com/project/_/authentication/settings) (e.g. http://127.0.0.1).

### 4. Running queries and mutations in VS Code
The VSCode Firebase Extension allows you to generate Firebase Data Connect SDK code, run queries/mutations, and deploy Firebase Data Connect with a click. Alternatively, see below for CLI commands.

1. Install [VS Code](https://code.visualstudio.com/).
2. Download the [Firebase extension](https://firebasestorage.googleapis.com/v0/b/firemat-preview-drop/o/vsix%2Ffirebase-vscode-latest.vsix?alt=media) and [install](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-an-extension) it.
3. Open this quickstart in VS code, and in the left pane of the Firebase extension, and log in with your Firebase account.
(Optional): If your Firebase project was not initialized in the last section, you can click `Run firebase init` and select `Data Connect` to initialize.
4. Click on deploy to deploy your schema to your cloud SQL instance. Or run `firebase deploy --only dataconnect` (this will also activate vectors search if it's enabled in the schema).
5. Running the VSCode extension should automatically start the DataConnect emulators. If you see an emulators error, try running `firebase emulators:start dataconnect` manually.

Now you should be able to deploy your schema, run mutations/queries, generate SDK code, and view your application locally.

### 5. Populating the database
1. Run `1_movie_insert.gql`, `2_actor_insert.gql`, `3_movie_actor_insert.gql`, and `4_user_favorites_review_insert.gql` files in the `./dataconnect` directory in order using the VS code extension, 

### 6. Running the app

1. `cd` into the src folder, and run `npm run dev` to start the localhost web app.
(Optional): To use the Firebase Auth emulator, run `firebase emulators:start` and uncomment the `connectAuthEmulator` function in `app/src/lib/firebase.ts`.

License
-------

© Google, 2024. Licensed under an [Apache-2](../../LICENSE) license.

