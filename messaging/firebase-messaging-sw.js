importScripts('https://www.gstatic.com/firebasejs/3.4.0/firebase-app.js');

firebase.initializeApp({});

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(data) {
  console.log('[firebase-messaging-sw.js] Received background message ', data);
  // Show notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
// [END background_handler]
