/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  DataSnapshot,
  getDatabase,
  limitToLast,
  onChildAdded,
  query,
  ref,
  connectDatabaseEmulator
} from 'firebase/database';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();
const database = getDatabase();
const functions = getFunctions();

// Locally, we use the firebase emulators.
if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectDatabaseEmulator(database, '127.0.0.1', 9000);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

/**
 * Initializes the Functions Web quickstart app.
 */
const signInButton = document.getElementById('sign-in-button')!;
const signOutButton = document.getElementById('sign-out-button')!;
const splashPage = document.getElementById('page-splash')!;
const messageText = document.getElementById('message-text')! as HTMLInputElement;
const addMessageButton = document.getElementById('add-message-button')! as HTMLInputElement;
const firstNumber = document.getElementById('first-number')! as HTMLInputElement;
const secondNumber = document.getElementById('second-number')! as HTMLInputElement;
const addNumbersButton = document.getElementById('send-addition-button')! as HTMLInputElement;
const messageContainer = document.getElementById('message-container')!;

// Add Click events to buttons.
// Adds two numbers by calling the `addNumbers` server-side function.
function addNumbers() {
  const firstNumberValue = parseFloat(firstNumber.value);
  const secondNumberValue = parseFloat(secondNumber.value);
  addNumbersButton.disabled = true;
  const sendNotification = httpsCallable(functions, 'addNumbers');
  sendNotification({ firstNumber: firstNumberValue, secondNumber: secondNumberValue }).then(function(result) {
      console.log('Cloud Function called successfully.', result);
      // Read results of the Cloud Function.
      const data = result.data as {
        firstNumber: number,
        secondNumber: number,
        operationResult: number,
        operator: string
      };
      const firstNumber = data.firstNumber;
      const secondNumber = data.secondNumber;
      const operationResult = data.operationResult;
      const operator = data.operator;
      window.alert('Here is the result of the formula: ' + firstNumber + ' '
        + operator + ' ' + secondNumber + ' = ' + operationResult);
      addNumbersButton.disabled = false;
    }
  ).catch(function(error) {
    // Getting the Error details.
    const code = error.code;
    const message = error.message;
    const details = error.details;
    console.error('There was an error when calling the Cloud Function', error);
    window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
      + code + '\nError Message:' + message + '\nError Details:' + details);
    addNumbersButton.disabled = false;
  });
}

// Adds a message to the Realtime Database by calling the `addMessage` server-side function.
function addMessage() {
  const messageTextInput = messageText.value;
  addMessageButton.disabled = true;
  const addMessage = httpsCallable(functions, 'addMessage');
  addMessage({ text: messageTextInput }).then(function(result) {
    // Read result of the Cloud Function.
    const data = result.data as { text: string };
    const sanitizedMessage = data.text;
    if (messageTextInput !== sanitizedMessage) {
      window.alert('You were naughty. Your message was sanitized to:\n\n' + sanitizedMessage);
    }
    messageText.value = '';
    addMessageButton.disabled = false;
  }).catch(function(error) {
    // Getting the Error details.
    const code = error.code;
    const message = error.message;
    const details = error.details;
    console.error('There was an error when calling the Cloud Function', error);
    window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
      + code + '\nError Message:' + message + '\nError Details:' + details);
    addMessageButton.disabled = false;
  });
}

// Start the Firebase signs-in flow via Google account.
async function signIn() {
  console.log('Signing-in anonymously.');
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

// The user signs-out his Firebase account.
async function signUserOut() {
  await signOut(auth);
}

// This is called when the Firebase auth state has changed. i.e. the User has signed-in or signed-out.
const onAuthStateChangedHandler = function(user: User | null) {
  if (user) {
    // When a user signs-in we remove the sign-in splash page.
    splashPage.style.display = 'none';
  } else {
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
  }
};

// This is called when a new Message has been added to the realtime Database.
const onNewMessage = function(snap: DataSnapshot) {
  const text = snap.val().text;
  const name = snap.val().author.name;
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-element');
  const authorContainer = document.createElement('div');
  authorContainer.innerText = name;
  authorContainer.classList.add('author-container');
  const textContainer = document.createElement('div');
  textContainer.innerText = text;
  messageElement.appendChild(authorContainer);
  messageElement.appendChild(textContainer);
  messageContainer.insertBefore(messageElement, messageContainer.firstChild);
};

signInButton.addEventListener('click', signIn);
signOutButton.addEventListener('click', signUserOut);
addMessageButton.addEventListener('click', addMessage.bind(this));
addNumbersButton.addEventListener('click', addNumbers.bind(this));
// Listen for auth state changes.
onAuthStateChanged(auth, onAuthStateChangedHandler);
// Listen for new Messages to be displayed.
onChildAdded(query(ref(database, '/messages'), limitToLast(10)), onNewMessage);

