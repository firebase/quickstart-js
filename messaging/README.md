Firebase Cloud Messaging Quickstart
===================================

The Firebase Cloud Messaging quickstart demonstrates how to request permission
to notify the user and receive FCM messages using the Firebase Cloud Messaging
JavaScript SDK.

Introduction
------------

- [Read more about Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/)

Getting Started
---------------

- Set up your project on the [Firebase Console](https://console.firebase.google.com).
- Replace the config object defined in `index.html` with the one generated from
  the Firebase Console **Overview > Add Firebase to your web app**.
- Run `firebase serve -p 8081` using the [Firebase CLI](https://firebase.google.com/docs/cli/)
  tool to launch a local server and open the sample `.html` in a web browser.
- Click REQUEST PERMISSION button to request permission for your app to send
  notifications to the browser.
- After the Instance ID token is generated you can use it to send an HTTP request
  to FCM that delivers the message to the web application.
### HTTP
```
POST /fcm/send HTTP/1.1
Host: fcm.googleapis.com
Authorization: key=YOUR-SERVER-KEY-HERE
Content-Type: application/json

{
  "notification": {
    "title": "Portugal vs. Denmark",
    "body": "5 to 1",
    "icon": "firebase-icon.png",
    "click_action": "http://localhost:8081"
  },
  "to": "YOUR-TOKEN-HERE"
}
```
### cURL
```
curl -X POST -H "Authorization: key=YOUR-SERVER-KEY-HERE" -H "Content-Type: application/json" -d '{
  "notification": {
    "title": "Portugal vs. Denmark",
    "body": "5 to 1",
    "icon": "firebase-icon.png",
    "click_action": "http://localhost:8081"
  },
  "to": "YOUR-TOKEN-HERE"
}' "https://fcm.googleapis.com/fcm/send"
```
- When the app has the browser focus , the received message is handled through
  the `onMessage` callback in index.html. When the app does not have browser
  focus then the `setBackgroundMessageHandler` callback in firebase-messaging-sw.js
  is where the received message is handled.

### Browser focus
Your app would be considered as having focus if it is running in the currently
selected browser tab. Otherwise it would be considered not in focus.

Support
-------

https://firebase.google.com/support/

License
-------

© Google, 2016. Licensed under an [Apache-2](../LICENSE) license.
