// Tell TypeScript that we are in Service Worker context, which is a specific
// type of Web Worker that has extra APIs available.
// https://github.com/Microsoft/TypeScript/issues/14877
declare var self: ServiceWorkerGlobalScope;

import firebase from 'firebase/app';
import 'firebase/messaging';
import { firebaseConfig } from '../common/configuration';

if (firebase.messaging.isSupported()) {
  // Do not call messaging functions if messaging is not supported.

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // If you would like to handle data messages that are received in the
  // background (web app is closed or not in browser focus) then you should
  // implement this optional method.
  //
  // See the chart here to understand when your callback will be called:
  // https://firebase.google.com/docs/cloud-messaging/js/receive
  messaging.setBackgroundMessageHandler(payload => {
    console.log('Received background message.', payload);

    // TODO(developer): Customize notification here based on data payload.
    const notificationTitle = 'Background Message Title';
    const notificationOptions: NotificationOptions = {
      body: 'Background Message body.',
      actions: [
        {
          action: 'like',
          title: 'Like'
        },
        {
          action: 'favorite',
          title: 'Favorite'
        }
      ]
    };

    // All messages received while the app is in the background trigger a display
    // notification in the browser. If you do not call showNotification, browsers
    // display a default notification that says "Website updated in the
    // background".
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });

  // Add an event listener to handle notification clicks.
  //
  // This is only needed if you send notifications with actions. FCM SDK handles
  // clicks on the notification itself, using the "link" field in your
  // notification payload. For more information, please see:
  // https://firebase.google.com/docs/cloud-messaging/js/receive#setting_notification_options_in_the_send_request
  //
  // Notification actions can be defined in the WebpushNotification payload,
  // using the "actions" field.
  // https://developer.mozilla.org/en-US/docs/Web/API/notification/actions
  // For more information, please see:
  // https://developers.google.com/web/updates/2016/01/notification-actions
  self.addEventListener('notificationclick', event => {
    if (event.action) {
      // An action button was clicked.
      // event.action corresponds to the "action" field of the clicked
      // NotificationAction.
      // https://notifications.spec.whatwg.org/#dictdef-notificationaction
      console.log(`Action button "${event.action}" was clicked.`);

      // Close the notification when an action button is clicked.
      event.notification.close();
    }
  });
}
