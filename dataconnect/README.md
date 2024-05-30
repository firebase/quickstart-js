Firebase DataConnect Quickstart
=======================================

Introduction
------------

This is a sample app for the preview version of the Firebase DataConnect.
This will not work if you don't have access to the preview.

<!-- Introduction
------------

[Read more about Firebase DataConnect ](https://firebase.google.com/docs/dataconnect/) -->

Getting Started
---------------

1. Sign up for early access [here](https://firebase.google.com/products/data-connect) and receive an invitation.
2. Upgrade your Firebase project billing to the Blaze plan, you will not be charged for the duration of gated preview.
3. Initialize DataConnect in the [Firebase Console](https://console.firebase.google.com/u/0/).
4. Clone this repository to your local machine.
5. Update `firebase-tools` with `npm install -g firebase-tools`.
6. Enable the DataConnect CLI with `firebase experiments:enable dataconnect`.
7. Initialize your Firebase project in the `dataconnect` folder with `firebase init` and select DataConnect.
8. Replace variables in `.env.local` with your project-specific values.
9. Allow domains for Firebase Auth (e.g., http://localhost or http://127.0.0.1).
10. Deploy DataConnect with `firebase deploy --only dataconnect` (this unlocks hidden vectors search).
11. Navigate to the `movie` directory and install dependencies with `npm i` and start the development server with `npm run dev`.
12. Run the four `_insert.gql` files in the `./dataconnect` directory in order.

<!-- Support
-------

- [Firebase Support](https://firebase.google.com/support/) -->

License
-------

© Google, 2024. Licensed under an [Apache-2](../LICENSE) license.
