Firebase Auth Quickstarts
=============================

The Firebase auth quickstart demonstrates several methods for signing in:

 - The [Firebase email/password quickstart](email.html) demonstrates using a Firebase stored email & password - you can both create and sign in a user.
 - The Firebase Google Sign in quickstarts demonstrate using a Google account to authenticate to Firebase using three different techniques: with a [popup](google-popup.html), a [redirect](google-redirect.html) and an [auth token](google-credentials.html).
 - The Firebase Facebook Login quickstarts demonstrate using a Facebook account to authenticate to Firebase using three different techniques: with a [popup](facebook-popup.html), a [redirect](facebook-redirect.html) and an [auth token](facebook-credentials.html).
 - The Firebase GitHub Login quickstarts demonstrate using a GitHub account to authenticate to Firebase using two different techniques: with a [popup](github-popup.html) and a [redirect](github-redirect.html).
 - The Firebase Twitter Login quickstarts demonstrate using a Twitter account to authenticate to Firebase using two different techniques: with a [popup](twitter-popup.html) and a [redirect](twitter-redirect.html).
 - The [Firebase Anonymous auth quickstart](anon.html) demonstrates how to authenticate to Firebase anonymously.
 - The [Firebase custom auth quickstart](customauth.html) demonstrates how to authenticate to Firebase with a user who has been authenticated from your own pre-existing authentication system. This is done by generating a token in a specific format, which is signed using the private key from a service account downloaded from the Google Developer Console. This token can then be passed to your client application which uses it to authenticate to Firebase. We provide an [example token generator](exampletokengenerator/auth.html) for demonstration purposes. Note: Generating tokens in production should be done server side.

We also provide the [code for a Chrome Extension](chromeextension) showing how to setup and authorize Firebase in a Chrome extension.

Introduction
------------

- [Read more about Firebase Auth](https://firebase.google.com/docs/auth/)

Getting Started
---------------

- Set up your project on the [Firebase Console](https://console.firebase.google.com).
- Enable the authentication method you want to use in the Auth section > SIGN IN METHOD tab - you don't need to enable custom auth.
- In the [Google Developer Console](https://console.developers.google.com), access the project you created in the Firebase Console. 
- For Custom Auth, also create a new Service Account in your project [Developers Console](https://console.developers.google.com/apis/credentials/serviceaccountkey?project=_), and download the JSON representation.
- For Facebook, Twitter and GitHub you will need to create an application as a developer on their developer platform, whitelist `https://<project_id>.firebaseapp.com/__/auth/handler` for auth redirects and enable and setup the app's credentials in the Firebase Console > Auth > SIGN IN METHOD.
- Edit the `.html` for the authentication method you want to try and copy the initialization snippet from the Firebase Console **Overview > Add Firebase to your web app** into the `<head>` section of `.html`.
- Run `firebase serve` using the Firebase CLI tool to launch a local server and open the sample `.html` in a web browser.

Support
-------

https://firebase.google.com/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
