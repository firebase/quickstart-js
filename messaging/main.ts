import { initializeApp } from 'firebase/app';
import {
  MessagePayload,
  getMessaging,
  onMessage,
  onRegistered,
  onUnregistered,
  register,
  unregister,
} from 'firebase/messaging';
import { firebaseConfig, vapidKey } from './config';

initializeApp(firebaseConfig);

const messaging = getMessaging();

// 7 days in milliseconds for FID server sync expiration.
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

// IDs of divs that display registration FID UI or request permission UI.
const fidDivId = 'fid_div';
const permissionDivId = 'permission_div';

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
onMessage(messaging, (payload: MessagePayload) => {
  console.log('Message received. ', payload);
  // Update the UI to include the received message.
  appendMessage(payload);
});

onRegistered(messaging, (fid) => {
  console.log('Registered with FID:', fid);
  sendFidToServer(fid);
  updateUIForPushEnabled(fid);
});

onUnregistered(messaging, (fid) => {
  console.log('Unregistered FID:', fid);
  setFidSentToServer(false);
  updateUIForUnregistered();
});

function resetUI() {
  clearMessages();
  if (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'granted'
  ) {
    showHideDiv(fidDivId, true);
    showHideDiv(permissionDivId, false);
    showFid('loading...');
    register(messaging, { vapidKey }).catch((err) => {
      console.warn('An error occurred while registering: ', err);
      updateUIForUnregistered();
    });
  } else {
    // Show permission request.
    console.log(
      'No registration FID available. Request permission to generate one.',
    );
    // Show permission UI.
    updateUIForPushPermissionRequired();
    setFidSentToServer(false);
  }
}

function showFid(currentFid: string) {
  // Show FID in console and UI.
  const fidElement = document.querySelector('#fid')!;
  fidElement.textContent = currentFid;
}

// Send the registration FID to your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the FID from topics
function sendFidToServer(currentFid: string) {
  if (!isFidRecentlySentToServer()) {
    console.log('Sending FID to server...', currentFid);
    // TODO(developer): Send the current FID to your server.
    setFidSentToServer(true);
  } else {
    console.log(
      "FID already sent to server so won't send it again unless it changes or expires",
    );
  }
}

function isFidRecentlySentToServer() {
  const sentTimestamp = window.localStorage.getItem('sentFidToServerTimestamp');
  if (!sentTimestamp) {
    return false;
  }
  const timeElapsed = Date.now() - parseInt(sentTimestamp, 10);
  return timeElapsed < SEVEN_DAYS_IN_MS;
}

function setFidSentToServer(sent: boolean) {
  if (sent) {
    window.localStorage.setItem(
      'sentFidToServerTimestamp',
      Date.now().toString(),
    );
  } else {
    window.localStorage.removeItem('sentFidToServerTimestamp');
  }
}

function showHideDiv(divId: string, show: boolean) {
  const div = document.querySelector('#' + divId)! as HTMLDivElement;
  if (show) {
    div.style.display = 'block';
  } else {
    div.style.display = 'none';
  }
}

function updateButtonStates(isRegistered: boolean) {
  const registerBtn = document.querySelector(
    '#register-button',
  ) as HTMLButtonElement | null;
  const unregisterBtn = document.querySelector(
    '#unregister-button',
  ) as HTMLButtonElement | null;
  if (registerBtn && unregisterBtn) {
    registerBtn.disabled = isRegistered;
    unregisterBtn.disabled = !isRegistered;
  }
}

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve Firebase Installation ID (FID) for use with FCM.
      // In many cases once an app has been granted notification permission,
      // it should update its UI reflecting this.
      resetUI();
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}

// Register FID with FCM.
function registerFidFromFirebase() {
  showFid('loading...');
  register(messaging, { vapidKey }).catch((err) => {
    console.warn('Failed to register: ', err);
    updateUIForUnregistered();
  });
}

// Unregister FID with FCM.
function unregisterFidFromFirebase() {
  unregister(messaging).catch((err) => {
    console.warn('Failed to unregister: ', err);
  });
}

// Add a message to the messages list.
function appendMessage(payload: MessagePayload) {
  const messagesElement = document.querySelector('#messages')!;
  const dataHeaderElement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style.overflowX = 'hidden;';
  dataHeaderElement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

// Clear the list of received messages.
function clearMessages() {
  const messagesElement = document.querySelector('#messages')!;
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild!);
  }
}

function updateUIForPushEnabled(currentFid: string) {
  showHideDiv(fidDivId, true);
  showHideDiv(permissionDivId, false);
  showFid(currentFid);
  updateButtonStates(true);
}

function updateUIForUnregistered() {
  showHideDiv(fidDivId, true);
  showHideDiv(permissionDivId, false);
  showFid('Not Registered');
  updateButtonStates(false);
}

function updateUIForPushPermissionRequired() {
  showHideDiv(fidDivId, false);
  showHideDiv(permissionDivId, true);
}

document
  .getElementById('request-permission-button')!
  .addEventListener('click', requestPermission);
document
  .getElementById('register-button')!
  .addEventListener('click', registerFidFromFirebase);
document
  .getElementById('unregister-button')!
  .addEventListener('click', unregisterFidFromFirebase);

resetUI();
