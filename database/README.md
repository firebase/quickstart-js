Firebase Realtime Database Quickstart
=============================

The Firebase Database quickstart demonstrates how to connect to the Firebase Realtime Database and
to send and retrieve data through a simple social blogging app. It will interoperate with the iOS and
Android database quickstarts.

Introduction
------------

[Read more about Firebase Database](https://firebase.google.com/docs/database/)

Getting Started
---------------

 1. Create your project on the [Firebase Console](https://console.firebase.google.com). Copy your Firebase config object (from the "Add Firebase to your web app" dialog), and paste it in the `config.ts` file in the database directory.
 2. Enable the **Google** sign-in provider in the **Authentication > SIGN-IN METHOD** tab.
 3. You must have the Firebase CLI installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 4. Run `npm install` to install the app's dependencies.
 5. On the command line run `firebase use --add` and select the Firebase project you have created.

To run the sample app locally during development:
 1. Run `npm install` to install dependencies.
 2. Run `firebase emulators:start` to start the local Firebase emulators.
 3. Run `npm run dev` to serve the app locally using Vite
   This will start a server locally that serves `index.html` on `http://localhost:5173/index.html`.


Running the app using the Firebase CLI:
 1. Run `npm install` to install dependencies.
 2. Run `npm run build` to build the app using Vite.
 3. Run `firebase emulators:start` to start the local Firebase emulators.
 4. In your terminal output, you will see the "Hosting" URL. By default, it will be `127.0.0.1:5002`, though it may be different for you.
 5. Navigate in your browser to the URL output by the `firebase emulators:start` command.

To deploy the sample app to production:
 1. Run `firebase deploy`.
   This will deploy the sample app to `https://<project_id>.firebaseapp.com`.

Support
-------

- [Firebase Support](https://firebase.google.com/support/)

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
