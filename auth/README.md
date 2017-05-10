Firebase Auth Quickstarts
=============================

The Firebase auth quickstart demonstrates several methods for signing in:

 - The [Firebase email/password quickstart](email.html) demonstrates using a Firebase stored email & password - you can both create and sign in a user.
 - The Firebase phone number authentication quickstart demonstrates using Firebase phone number authentication using three different techniques: with a [visible ReCaptcha](phone.html), an [invisible ReCaptcha](phone-invisible.html) and a [simplified popup flow](phone-simple.html) (not recommended for production apps).
 - The Firebase Google Sign in quickstarts demonstrate using a Google account to authenticate to Firebase using three different techniques: with a [popup](google-popup.html), a [redirect](google-redirect.html) and an [auth token](google-credentials.html).
 - The Firebase Facebook Login quickstarts demonstrate using a Facebook account to authenticate to Firebase using three different techniques: with a [popup](facebook-popup.html), a [redirect](facebook-redirect.html) and an [auth token](facebook-credentials.html).
 - The Firebase GitHub Login quickstarts demonstrate using a GitHub account to authenticate to Firebase using two different techniques: with a [popup](github-popup.html) and a [redirect](github-redirect.html).
 - The Firebase Twitter Login quickstarts demonstrate using a Twitter account to authenticate to Firebase using two different techniques: with a [popup](twitter-popup.html) and a [redirect](twitter-redirect.html).
 - The [Firebase Anonymous auth quickstart](anon.html) demonstrates how to authenticate to Firebase anonymously.
 - The [Firebase custom auth quickstart](customauth.html) demonstrates how to authenticate to Firebase with a user who has been authenticated from your own pre-existing authentication system. This is done by generating a token in a specific format, which is signed using the private key from a service account downloaded from the Google Developer Console. This token can then be passed to your client application which uses it to authenticate to Firebase. We provide an [example token generator](exampletokengenerator/auth.html) for demonstration purposes. Note: Generating tokens in production should be done server side.

We also provide the [code for a Chrome Extension](chromeextension) showing how to setup and authorize Firebase in a Chrome extension.

Introduction
------------

[Read more about Firebase Auth](https://firebase.google.com/docs/auth/)

Getting Started
---------------

 1. Create a Firebase project on the [Firebase Console](https://console.firebase.google.com).
 1. Enable the authentication method you want to use by going to the **Authentication** section in the **SIGN-IN METHOD** tab - you don't need to enable custom auth.
     - For **Custom Auth**, generate a Service Account credentials in your [Firebase Console > Project Settings > Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk), and click on **GENERATE NEW PRIVATE KEYS**. You will need it in the [example token generator](exampletokengenerator/auth.html).
     - For **Facebook**, **Twitter** and **GitHub** you will need to create an application as a developer on their respective developer platform, whitelist `https://<project_id>.firebaseapp.com/__/auth/handler` for auth redirects and enable and setup the app's credentials in the **Firebase Console > Authentication > SIGN-IN METHOD**.
 1. You must have the [Firebase CLI](https://firebase.google.com/docs/cli/) installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 1. On the command line run `firebase use --add` and select the Firebase project you have created.
 1. Run `firebase serve` using the Firebase CLI tool to launch a local server and open the sample `.html` in a web browser.

Support
-------

https://firebase.google.com/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
