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
'use strict';

/**
 * Initializes the Functions Web quickstart app.
 */
function FunctionsQuickstart() {
  this.signInButton = document.getElementById('sign-in-button');
  this.signOutButton = document.getElementById('sign-out-button');
  this.splashPage = document.getElementById('page-splash');
  this.messageText = document.getElementById('message-text');
  this.addMessageButton = document.getElementById('add-message-button');
  this.firstNumber = document.getElementById('first-number');
  this.secondNumber = document.getElementById('second-number');
  this.addNumbersButton = document.getElementById('send-addition-button');
  this.messageContainer = document.getElementById('message-container');

  // Add Click events to buttons.
  this.signInButton.addEventListener('click', this.signIn);
  this.signOutButton.addEventListener('click', this.signOut);
  this.addMessageButton.addEventListener('click', this.addMessage.bind(this));
  this.addNumbersButton.addEventListener('click', this.addNumbers.bind(this));
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  // Listen for new Messages to be displayed.
  firebase.database().ref('/messages').limitToLast(10).on('child_added', this.onNewMessage.bind(this));
}

// Adds two numbers by calling the `addNumbers` server-side function.
FunctionsQuickstart.prototype.addNumbers = function() {
  var firstNumber = parseFloat(this.firstNumber.value);
  var secondNumber = parseFloat(this.secondNumber.value);
  var addNumbersButton = this.addNumbersButton;
  addNumbersButton.disabled = true;
  // [START callAddFunction]
  var sendNotification = firebase.functions().httpsCallable('addNumbers');
  sendNotification({firstNumber: firstNumber, secondNumber: secondNumber}).then(function(result) {
    console.log('Cloud Function called successfully.', result);
    // Read results of the Cloud Function.
    var firstNumber = result.data.firstNumber;
    var secondNumber = result.data.secondNumber;
    var operationResult = result.data.operationResult;
    var operator = result.data.operator;
    // [START_EXCLUDE]
    window.alert('Here is the result of the formula: ' + firstNumber + ' '
        + operator + ' ' + secondNumber + ' = ' + operationResult);
    addNumbersButton.disabled = false;
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Getting the Error details.
    var code = error.code;
    var message = error.message;
    var details = error.details;
    // [START_EXCLUDE]
    console.error('There was an error when calling the Cloud Function', error);
    window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
        + code + '\nError Message:' + message + '\nError Details:' + details);
    addNumbersButton.disabled = false;
    // [END_EXCLUDE]
  });
  // [END callAddFunction]
};


// Adds a message to the Realtime Database by calling the `addMessage` server-side function.
FunctionsQuickstart.prototype.addMessage = function() {
  var messageTextInput = this.messageText;
  var messageText = messageTextInput.value;
  var addMessageButton = this.addMessageButton;
  addMessageButton.disabled = true;
  // [START callAddMessageFunction]
  // [START callAddMessageFunctionWithError]
  var addMessage = firebase.functions().httpsCallable('addMessage');
  addMessage({text: messageText}).then(function(result) {
    // Read result of the Cloud Function.
    var sanitizedMessage = result.data.text;
    // [END callAddMessageFunctionWithError]
    // [START_EXCLUDE silent]
    if (messageText !== sanitizedMessage) {
      window.alert('You were naughty. Your message was sanitized to:\n\n' + sanitizedMessage);
    }
    messageTextInput.value = '';
    addMessageButton.disabled = false;
  // [START catchError]
  }).catch(function(error) {
    // Getting the Error details.
    var code = error.code;
    var message = error.message;
    var details = error.details;
    // [START_EXCLUDE]
    console.error('There was an error when calling the Cloud Function', error);
    window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
        + code + '\nError Message:' + message + '\nError Details:' + details);
    addMessageButton.disabled = false;
    // [END_EXCLUDE]
    // [END_EXCLUDE]
  });
  // [END catchError]
  // [END callAddMessageFunction]
};

// Start the Firebase signs-in flow via Google account.
FunctionsQuickstart.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

// The user signs-out his Firebase account.
FunctionsQuickstart.prototype.signOut = function() {
  firebase.auth().signOut();
};

// This is called when the Firebase auth state has changed. i.e. the User has signed-in or signed-out.
FunctionsQuickstart.prototype.onAuthStateChanged = function(user) {
  if (user) {
    // When a user signs-in we remove the sign-in splash page.
    this.splashPage.style.display = 'none';
  } else {
    // Display the splash page where you can sign-in.
    this.splashPage.style.display = '';
  }
};

// This is called when a new Message has been added to the realtime Database.
FunctionsQuickstart.prototype.onNewMessage = function(snap) {
  var text = snap.val().text;
  var name = snap.val().author.name;
  var messageElement = document.createElement('div');
  messageElement.classList.add('message-element');
  var authorContainer = document.createElement('div');
  authorContainer.innerText = name;
  authorContainer.classList.add('author-container');
  var textContainer = document.createElement('div');
  textContainer.innerText = text;
  messageElement.appendChild(authorContainer);
  messageElement.appendChild(textContainer);
  this.messageContainer.insertBefore(messageElement, this.messageContainer.firstChild);
};

window.onload = function() {
  window.app = new FunctionsQuickstart();
};
