Firebase HTTPS Callable functions Web Quickstart
================================================

The HTTPS Callable functions Web Quickstart demonstrates how to send requests to a server-side function and get a response back using the Firebase JS SDK. It interoperates with the iOS and Android database quickstarts.


Introduction
------------

[Read more about Cloud Functions for Firebase](https://firebase.google.com/docs/functions/)


Getting Started
---------------

 1. Create your project in the [Firebase Console](https://console.firebase.google.com).
 2. Enable the **Google** sign-in provider in the **Authentication > SIGN-IN METHOD** tab.
 3. You must have the Firebase CLI installed. If you don't have it, install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
 4. Clone this repository and open the **functions** directory: `git clone https://github.com/firebase/quickstart-js; cd quickstart-js/functions`
 5. Install cloud functions dependencies: `npm --prefix functions install`
 6. On the command line run `firebase use --add` and select the Firebase project you have created.
 7. On the command line run `firebase deploy` to deploy the application.
 8. On the command line run `firebase open hosting:site` to open the deployed web app.
 9. Sign in the Application using the Button.
 10. Write two numbers in the boxes and Click the "Add the Two Numbers" button.
      - You should be getting the result of the addition.
 11. Write a message in the Box below and Click the "Add Message" button.
      - The message is added below but if it contains [bad words](https://github.com/web-mech/badwords-list) or SHOUTING!! it will be sanitized.
 
To run the sample app locally during development:
1. Run `npm install` to install dependencies.
2. Run `npm --prefix functions run build` to build the functions using Vite.
3. Run `firebase emulators:start` to start the local Firebase emulators.
4. Run `npm run dev` to serve the app locally using Vite
   This will start a server locally that serves `index.html` on `http://localhost:5173/index.html`.

Running the app using the Firebase CLI:
1. Run `npm install` to install dependencies.
2. Run `npm run build` to build the app using Vite.
3. Run `firebase emulators:start` to start the local Firebase emulators.
4. In your terminal output, you will see the "Hosting" URL. By default, it will be `127.0.0.1:5002`, though it may be different for you.
5. Navigate in your browser to the URL output by the `firebase emulators:start` command.

Support
-------

- [Firebase Support](https://firebase.google.com/support/)


License
-------

© Google, 2018. Licensed under an [Apache-2](../LICENSE) license.
