import firebase from 'firebase/app';
import 'firebase/messaging';
import React from 'react';
import { render } from 'react-dom';
import { firebaseConfig, vapidKey } from '../common/configuration';
import { App } from './components/app';

const root = document.createElement('div');
document.body.appendChild(root);

function getMessaging() {
  if (firebase.messaging.isSupported()) {
    firebase.initializeApp(firebaseConfig);

    // Retrieve Firebase Messaging object.
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(vapidKey);

    return messaging;
  } else {
    // Messaging is not supported or cookies are disabled.
    return undefined;
  }
}

render(<App messaging={getMessaging()} />, root);
