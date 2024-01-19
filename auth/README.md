Firebase Auth Quickstarts
=============================

The Firebase Auth quickstart demonstrates several methods for signing in:

 - The [Firebase email and password authentication quickstart](email-password.html) demonstrates using a Firebase stored email & password to authenticate - you can both create and sign in a user.
 - The [Firebase email link authentication quickstart](email-link.html) demonstrates using an email address to sign-in without a password, via a link sent through email - you can both create and sign in a user.
 - The Firebase phone number authentication quickstart demonstrates using Firebase phone number authentication using three different techniques: with a [visible ReCaptcha](phone-visible.html), an [invisible ReCaptcha](phone-invisible.html) and a [simplified popup flow](phone-simple.html) (not recommended for production apps).
 - The Firebase Google Sign in quickstarts demonstrate using a Google account to authenticate to Firebase using three different techniques: with a [popup](google-popup.html), a [redirect](google-redirect.html) and an [auth token](google-credentials.html).
 - The Firebase Facebook Login quickstarts demonstrate using a Facebook account to authenticate to Firebase using three different techniques: with a [popup](facebook-popup.html), a [redirect](facebook-redirect.html) and an [auth token](facebook-credentials.html).
 - The Firebase Twitter Login quickstarts demonstrate using a Twitter account to authenticate to Firebase using two different techniques: with a [popup](twitter-popup.html) and a [redirect](twitter-redirect.html).
  - The Firebase Microsoft Login quickstarts demonstrate using a Microsoft account to authenticate to Firebase using two different techniques: with a [popup](microsoft-popup.html) and a [redirect](microsoft-redirect.html).
 - The Firebase GitHub Login quickstarts demonstrate using a GitHub account to authenticate to Firebase using two different techniques: with a [popup](github-popup.html) and a [redirect](github-redirect.html).
 - The [multi-factor authentication quickstart](mfa-password.html) demonstrates using email & password as the first factor and phone number as the second factor to authenticate - you can both enroll for the second factor and sign in with the second factor. Note: Multi-factor authentication with SMS is currently only available for [Google Cloud Identity Platform](https://cloud.google.com/identity-platform/docs/web/mfa) projects.
 - The [Firebase Anonymous auth quickstart](anon.html) demonstrates how to authenticate to Firebase anonymously.
 - The [Firebase custom auth quickstart](customauth.html) demonstrates how to authenticate to Firebase with a user who has been authenticated from your own pre-existing authentication system. This is done by generating a token in a specific format, which is signed using the private key from a service account downloaded from the Google Developer Console. This token can then be passed to your client application which uses it to authenticate to Firebase. We provide an [example token generator](exampletokengenerator/auth.html) for demonstration purposes. Note: Generating tokens in production should be done server side.

We also provide the [code for a Chrome Extension](chromextension) showing how to setup and authorize Firebase in a Chrome extension.

Introduction
------------

[Read more about Firebase Auth](https://firebase.google.com/docs/auth/)

Getting Started
---------------

 1. Create a Firebase project on the [Firebase Console](https://console.firebase.google.com). Copy your Firebase config object (from the "Add Firebase to your web app" dialog), and paste it in the `config.ts` file in the auth directory.
 2. Add a support email to your project in the [settings page](https://console.firebase.google.com/u/0/project/_/settings/general/). Some auth methods won't work without this.
 3. Enable the authentication method you want to use by going to the **Authentication** section in the **SIGN-IN METHOD** tab - you don't need to enable custom auth.
     - For **Custom Auth**, generate a Service Account credentials in your [Firebase Console > Project Settings > Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk), and click on **GENERATE NEW PRIVATE KEYS**. You will need it in the [example token generator](exampletokengenerator/auth.html).
     - For **Facebook**, **Twitter** and **GitHub** you will need to create an application as a developer on their respective developer platform, whitelist `https://<project_id>.firebaseapp.com/__/auth/handler` for auth redirects and enable and setup the app's credentials in the **Firebase Console > Authentication > SIGN-IN METHOD**.
 4. You must have the [Firebase CLI](https://firebase.google.com/docs/cli/) installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 5. On the command line, `cd` into the `quickstart-js/auth` subdirectory.
 6. Run `firebase use --add` and select your Firebase project.

To run the sample app locally during development:
 1. Run `npm install` to install dependencies.
 2. Run `firebase emulators:start` to start the local Firebase emulators. Note: phone authentication required ReCaptcha verification which does not work with the Firebase emulators. These examples skip connecting to the emulators.
 3. Run `npm run dev` to serve the app locally using Vite
   This will start a server locally that serves `index.html` on `http://localhost:5173/index.html`. 


Running the app using the Firebase CLI:
 1. Run `npm install` to install dependencies.
 2. Run `npm run build` to build the app using Vite.
 3. Run `firebase emulators:start` to start the local Firebase emulators. Note: phone authentication required ReCaptcha verification which does not work with the Firebase emulators. These examples skip connecting to the emulators.
 4. In your terminal output, you will see the "Hosting" URL. By default, it will be `127.0.0.1:5002`, though it may be different for you.
 5. Navigate in your browser to the URL output by the `firebase emulators:start` command.

To deploy the sample app to production:
 1. Run `firebase deploy`.
    This will deploy the sample app to `https://<project_id>.firebaseapp.com`.

Support
-------

https://firebase.google.com/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
