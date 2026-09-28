# Firebase Cloud Messaging Quickstart

The Firebase Cloud Messaging quickstart demonstrates how to:

- Request permission to send app notifications to the user.
- Receive FCM messages using the Firebase Cloud Messaging JavaScript SDK.

## Introduction

[Read more about Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/)

## Getting Started

1. Create your project in the Firebase Console by following [**Step 1: Create a Firebase Project**](https://firebase.google.com/docs/web/setup/#create-firebase-project)
2. Register a web app by following [**Step 2: Register your app with Firebase**](https://firebase.google.com/docs/web/setup/#create-firebase-project).
   1. You don't need to add Hosting right now, and you can skip the "Add Firebase SDK" step in the console's "Add Firebase to your web app" flow.
   2. Remember to click "Register App" or "Continue to console" at the bottom of the "Add Firebase to your web app" flow.
   3. Copy your Firebase config object (from the "Add Firebase to your web app" dialog), and paste it in the `config.ts` file in the messaging directory.
3. Open Project and go to **Project settings > Cloud Messaging** and there in the **Web configuration** section click **Generate key pair** button.
4. Copy public key and in the `config.ts` file replace `<YOUR_PUBLIC_VAPID_KEY_HERE>` with your key.
5. You must have the [Firebase CLI](https://firebase.google.com/docs/cli/) installed. If you don't have it install it with `npm install -g firebase-tools` and then configure it with `firebase login`.
6. On the command line run `firebase use --add` and select the Firebase project you have created.

To run the sample app locally during development:

1. Run `npm install` to install dependencies.
2. Run `firebase emulators:start` to start the local Firebase emulators. Note: phone authentication required ReCaptcha verification which does not work with the Firebase emulators. These examples skip connecting to the emulators.
3. Run `npm run dev` to serve the app locally using Vite.
   This will start a server locally that serves `index.html` on `http://localhost:5173/index.html`.
4. Click **REQUEST PERMISSION** button to request permission for the app to send notifications to the browser and register.
5. Use the registered Firebase Installation ID (FID) to send an HTTP request to FCM HTTP v1 API that delivers the message to the web application, inserting appropriate values for `YOUR-PROJECT-ID`, `YOUR-ACCESS-TOKEN`, and `YOUR-FID`.

Running the app using the Firebase CLI:

1. Run `npm install` to install dependencies.
2. Run `npm run build` to build the app using Vite.
3. Run `firebase emulators:start` to start the local Firebase emulators. Note: phone authentication required ReCaptcha verification which does not work with the Firebase emulators. These examples skip connecting to the emulators.
4. In your terminal output, you will see the "Hosting" URL. By default, it will be `127.0.0.1:5002`, though it may be different for you.
5. Navigate in your browser to the URL output by the `firebase emulators:start` command.
6. Click **REQUEST PERMISSION** button to request permission for the app to send notifications to the browser.
7. Use the registered Firebase Installation ID (FID) to send an HTTP request to FCM HTTP v1 API that delivers the message to the web application, inserting appropriate values for `YOUR-PROJECT-ID`, `YOUR-ACCESS-TOKEN`, and `YOUR-FID`.

To deploy the sample app to production:

1. Run `firebase deploy`.
   This will deploy the sample app to `https://<project_id>.firebaseapp.com`.

NOTE: If your payload has a `notification` object, `onBackgroundMessage` will not trigger. Read [here](https://firebase.google.com/docs/cloud-messaging/js/receive) for more information.

### HTTP

```
POST /v1/projects/YOUR-PROJECT-ID/messages:send HTTP/1.1
Host: fcm.googleapis.com
Authorization: Bearer YOUR-ACCESS-TOKEN
Content-Type: application/json; UTF-8

{
  "message": {
    "fid": "YOUR-FID",
    "notification": {
      "title": "Portugal vs. Denmark",
      "body": "5 to 1"
    },
    "webpush": {
      "notification": {
        "icon": "/firebase-logo.png"
      }
    }
  }
}
```

### Fetch

```js
var projectId = 'YOUR-PROJECT-ID';
var accessToken = 'YOUR-ACCESS-TOKEN';
var fid = 'YOUR-FID';
var message = {
  fid: fid,
  notification: {
    title: 'Portugal vs. Denmark',
    body: '5 to 1',
  },
  webpush: {
    notification: {
      icon: '/firebase-logo.png',
    },
  },
};

fetch(
  'https://fcm.googleapis.com/v1/projects/' + projectId + '/messages:send',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json; UTF-8',
    },
    body: JSON.stringify({
      message: message,
    }),
  },
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.error(error);
  });
```

### cURL

```
curl -X POST -H "Authorization: Bearer YOUR-ACCESS-TOKEN" -H "Content-Type: application/json; UTF-8" -d '{
  "message": {
    "fid": "YOUR-FID",
    "notification": {
      "title": "Portugal vs. Denmark",
      "body": "5 to 1"
    },
    "webpush": {
      "notification": {
        "icon": "/firebase-logo.png"
      }
    }
  }
}' "https://fcm.googleapis.com/v1/projects/YOUR-PROJECT-ID/messages:send"
```

### App focus

When the app has the browser focus, the received message is handled through
the `onMessage` callback in `main.ts`. When the app does not have browser
focus then the `onBackgroundMessage` callback in `firebase-messaging-sw.js`
is where the received message is handled.

The browser gives your app focus when both:

1. Your app is running in the currently selected browser tab.
2. The browser tab's window currently has focus, as defined by the operating system.

## Support

https://firebase.google.com/support/

## License

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
