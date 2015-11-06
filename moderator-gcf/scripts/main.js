/**
 * Copyright 2015 Google Inc. All Rights Reserved.
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

// Initializes the Guestbook.
function Guestbook() {

  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('message-list');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.nameInput = document.getElementById('name');
  this.submitButton = document.getElementById('submit');

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage());

  // Toggle for the button.
  this.toggleButton = this.toggleButton();
  this.messageInput.addEventListener('keyup', this.toggleButton);
  this.nameInput.addEventListener('keyup', this.toggleButton);
  this.messageInput.addEventListener('change', this.toggleButton);
  this.nameInput.addEventListener('change', this.toggleButton);

  // Function calling displayMessage with correct attributes from Firebase data.
  var callDisplayMessage = function (data) {
    var val = data.val();
    this.displayMessage(data.key(), val.name, val.message, val.moderated);
  }.bind(this);

  // Loads the last 10 messages and listen for new ones.
  this.messagesRef.limitToLast(12).on("child_added", callDisplayMessage);
  // Listen for messages updates.
  this.messagesRef.limitToLast(12).on("child_changed", callDisplayMessage);
}

// Reference to the Messages feed in the Firebase DB.
Guestbook.prototype.messagesRef =
  new Firebase('https://<YOUR_APP_ID>.firebaseio-staging.com/messages');

// Saves a new message on the Firebase DB.
Guestbook.prototype.saveMessage = function() {
  return function(e) {
    e.preventDefault();
    if (this.messageInput.value && this.nameInput.value) {
      this.messagesRef.push({
        name: this.nameInput.value,
        message: this.messageInput.value,
        timestamp: Firebase.ServerValue.TIMESTAMP
      }, function (error) {
        if (error) {
          console.log(error);
        } else {
          this.resetMaterialTextfield(this.messageInput);
          this.resetMaterialTextfield(this.nameInput);
          this.toggleButton();
        }
      }.bind(this));
    }
    return false;
  }.bind(this);
};

// Resets the given MaterialTextField.
Guestbook.prototype.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  element.blur();
};

// Template for message cards.
Guestbook.prototype.messageCardTemplate =
  '<div class="mdl-card mdl-cell mdl-cell--12-col mdl-card__supporting-text ' +
              'mdl-shadow--2dp mdl-cell--4-col-tablet ' +
              'mdl-cell--4-col-desktop">' +
      '<div class="message"></div>' +
      '<div class="author"></div>' +
      '<div class="moderated"></div>' +
  '</div>';

// Displays a Visitor's Book Message in the UI.
Guestbook.prototype.displayMessage = function(key, name, message, moderated) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = this.messageCardTemplate;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.insertBefore(div,
      document.getElementById('message-title').nextSibling);
  }
  div.querySelector('.author').textContent = name;
  div.querySelector('.moderated').textContent =
    moderated ? '(This message has been moderated)' : '';
  div.querySelector('.message').textContent = message;
  // Replace all line breaks by <br>.
  div.querySelector('.message').innerHTML =
    div.querySelector('.message').innerHTML.replace('\n', '<br>');
};

// Enables or disables the submit button depending on the values of the input
// fields.
Guestbook.prototype.toggleButton = function() {
  return function() {
    if (this.messageInput.value && this.nameInput.value) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'true');
    }
  }.bind(this);
};

// Bindings on load.
window.addEventListener('load', function() {
  new Guestbook();
});
