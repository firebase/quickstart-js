# FCM JS SDK React + TypeScript + Webpack Example

The Firebase Cloud Messaging quickstart demonstrates how to:

- Request permission to send app notifications to the user.
- Receive FCM messages using the Firebase Cloud Messaging JavaScript SDK.
- Use React and TypeScript with Firebase Cloud Messaging.
- Use Webpack and TypeScript to bundle your window and service worker code while keeping type safety.

Read more about Firebase Cloud Messaging [here](https://firebase.google.com/docs/cloud-messaging/).

## Getting Started

1. Set up your Firebase Project.
   1. Create your project on the [Firebase Console](https://console.firebase.google.com).
   1. Select your project and go to **Project settings**.
   1. Under the **Cloud Messaging** tab, in the section **Web configuration**, click the **Generate key pair** button.
   1. Copy public key and in `src/common/configuration.ts` file replace `<YOUR_PUBLIC_VAPID_KEY_HERE>` with your key.
   1. Under the **General** tab, find your Web App or create a new one, copy the Firebase Config object that corresponds to your app, and replace the config object in `src/common/configuration.ts` with the object you copied.
1. Build and run the example.
   1. On the command line run `npm install` to install dependencies.
   1. Run `npm run serve` to serve a development build.
   1. Once you open the link to the app, click **Request Permission** button to request permission for the app to send notifications to the browser.
   1. You can use the generated FCM Registration Token to send a message to your web app by following [this guide](https://firebase.google.com/docs/cloud-messaging/js/first-message#send_a_notification_message).
   1. You can also run `npm run build` to create a production build under `dist/`.

## Support

https://firebase.google.com/support/

## License

© Google, 2019. Licensed under an [Apache-2](../LICENSE) license.
