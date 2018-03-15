Firebase HTTPS Callable functions Web Quickstart
================================================

The HTTPS Callable functions Web Quickstart demonstrates how to send requests to a server-side function and get a response back using the Firebase JS SDK. It interoperates with the iOS and Android database quickstarts.


Introduction
------------

[Read more about Cloud Functions for Firebase](https://firebase.google.com/docs/functions/)


Getting Started
---------------

 1. Create your project in the [Firebase Console](https://console.firebase.google.com).
 1. Enable the **Google** sign-in provider in the **Authentication > SIGN-IN METHOD** tab.
 1. You must have the Firebase CLI installed. If you don't have it, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 1. Clone this repository and open the **functions** directory: `git clone https://github.com/firebase/quickstart-js; cd functions`
 1. Install cloud functions dependencies: `npm --prefix functions install`
 1. On the command line run `firebase use --add` and select the Firebase project you have created.
 1. On the command line run `firebase deploy` to deploy the application.
 1. On the command line run `firebase open hosting:site` to open the deployed web app.
 1. Sign in the Application using the Button.
 1. Write two numbers in the boxes and Click the "Add the Two Numbers" button.
     - You should be getting the result of the addition.
 1. Write a message in the Box below and Click the "Add Message" button.
     - The message is added below but if it contains [bad words](https://github.com/web-mech/badwords-list) or SHOUTING!! it will be sanitized.


Support
-------

- [Firebase Support](https://firebase.google.com/support/)


License
-------

© Google, 2018. Licensed under an [Apache-2](../LICENSE) license.
