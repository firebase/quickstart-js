Firebase Auth w/ Chrome Extensions Quickstart
=============================================

This sample shows how to authorize Firebase in a Chrome extension using a Google account.

Introduction
------------

- [Read more about Firebase Auth](https://firebase.google.com/docs/auth/)

Getting Started
---------------

- Create a Firebase project using the [Firebase Console](https://console.firebase.google.com).
- Create a new OAuth Client ID in your project's [Developers Console](https://console.developers.google.com/apis/credentials/oauthclient?project=_), Select **Chrome App** and enter your Chrome Extension/App ID.
- In your project's Firebase Console, enable the **Google** authentication method in the **Auth** section > **SIGN IN METHOD** tab.
- Add the Client ID you created to the whitelist using the **Whitelist client IDs from external projects (optional)**
- Edit the `credential.js` and enter your project's identifiers you get from the Firebase Console **Overview > Add Firebase to your web app**.
- Edit the `manifest.json` and enter your **Client ID** and your extension's **Public Key**. Also make sure you remove all comment lines (starting with `//`) in the `manifest.json` file before deploying your extension online.
- Install the Extension in your browser and click on the extension's icon once installed. The first time your users will install the extension they will have to authorize Firebase using the login button.

Feel free to try out a deployed version of the Chrome Extension directly: https://chrome.google.com/webstore/detail/lpgchdfbjddonaolofeijjackhnhnlla


Support
-------

https://firebase.google.com/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../../LICENSE) license.
