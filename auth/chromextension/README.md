# Firebase Auth w/ Google Sign-In in Chrome Extensions

This sample demonstrates how to authorize a user with Firebase in a Chrome extension using Google Sign-In and setup the Chrome extension to allow the use of the Realtime Database and Firebase Storage.

## Introduction

- [Read more about Firebase Auth](https://firebase.google.com/docs/auth/)

## Setting up this sample

### Creating a dummy Chrome extension

Setting up authentication in Chrome extensions via firebase require **Auth client ID** that can be obtain by Creating an OAuth Client.

### Creating an OAuth Client

- Create a new **OAuth Client ID** in [your project's Developers Console](https://console.developers.google.com/apis/credentials/oauthclient?project=_) (Click this link and select your Firebase project).
- Select **Chrome App** and enter your Chrome Extension/App ID (the `Item ID` obtained above).
- Note the `Client ID` (e.g. `7159....j00.apps.googleusercontent.com`) as you will need this below.

Now Create a new directory and add a `manifest.json` file similar to the following:

    {
      "manifest_version": 3,
      "name": "Firebase Auth in Chrome Extension Sample",
      "description": "This sample shows how to authorize Firebase in a Chrome extension using a Google account.",
      "version": "0.1",
      "permissions": [
        "identity"
      ],
      "oauth2": {
        "client_id": "---Auth client ID---",
        "scopes": [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ]
    }

Upload the dummy extension to the app store by going to the [Chrome App Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) and clicking **Add a New Item**. For more reading on publishing to the Chrome Web Store, go [here](https://developer.chrome.com/webstore/publish).

> Of course if you already own an extension and would like to add Firebase to it, add the oauth2 section.

### Configuring your Firebase Project

- Create or select a Firebase project at [Firebase Console](https://console.firebase.google.com).
- Enable the **Google** authentication method in the **Auth** section > **SIGN IN METHOD** tab.
- Add the Client ID you created to the whitelist using the **Whitelist client IDs from external projects (optional)**
- Edit the `credential.js` and `background.js` and enter your project's identifiers you get from the Firebase Console **Overview > Add Firebase to your web app**.
- Edit the `manifest.json`
  - Enter your **OAuth Client ID**.
  - Remove all comment lines (starting with `//`) in the `manifest.json` file before deploying your extension online.
- Install the Extension in your browser and click on the extension's icon once installed. The first time your users will install the extension they will have to authorize Firebase using the login button.

## Using Firebase in your own extension

The keys to using Firebase in a Chrome extension are:

- Because of Chrome Extensions' [Content Security Policy](https://developer.chrome.com/extensions/contentSecurityPolicy) you need to avoid inline JavaScript in your HTML pages so you need to add some sort of module bundler to avoid that.

  - As Chrome MV3 no longer allowed remote hosted code. Using module bundlers we can add the required code for your extension. Any modular script should be added as entry point.

- Because of module bundler now you can use [typically instruct](https://firebase.google.com/docs/web/setup) to setup the firebase.

```javascript
// Initialize Firebase
import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);
```

- Create a Google Client ID that's authorized for your Chrome extension and whitelist it in your Firebase project:
  - Create a new OAuth Client ID in your project's [Developers Console](https://console.developers.google.com/apis/credentials/oauthclient?project=_), Select **Chrome App** and enter your Chrome Extension/App ID.
  - In your project's Firebase Console, enable the **Google** authentication method in the **Auth** section > **SIGN IN METHOD** tab.
  - Add the Client ID you created to the whitelist using the **Whitelist client IDs from external projects (optional)**
- Use the chrome.identity API to get a Google OAuth token as described in https://developer.chrome.com/apps/app_identity and then use this token to authorize Firebase using [Auth.signInWithCredential()](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithCredential):

```javascript
const auth = getAuth(app);

const credential = GoogleAuthProvider.credential(null, token);

await signInWithCredential(auth, credential)
  .then((result) => {
    console.log(result);

    console.log("User name is : " + result.user.displayName);
  })
  .catch((error) => {
    // You can handle errors here
    console.log(error);
  });
```

### Now this section is not require

As Manifest V3 disallows certain CSP modifications for `extension_pages` that were permitted in Manifest V2. [Content security policy](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#content-security-policy) for Manifest V3.

    ```javascript
    "content_security_policy":"script-src 'self' https://www.gstatic.com/ https://*.firebaseio.com https://www.googleapis.com; object-src 'self'"
    ```

## Support

https://firebase.google.com/support/

## License

© Google, 2016. Licensed under an [Apache-2](../../LICENSE) license.
