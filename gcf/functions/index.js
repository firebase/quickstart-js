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

/**
 * For more information on setting up and running this sample code, see
 * https://developers.google.com/firebase/docs/cloud-functions/writing-functions
 */

'use strict';

// [START imports]
var Firebase = require('firebase');
var env = require('./env');
var ref = new Firebase(env.get('firebase.database.url'));
// [END imports]

// [START function]
// Makes all new messages ALL UPPERCASE.
exports.makeuppercase = function(context, data) {

  // Read the Firebase database object that triggered the function.
  var messageRef = ref.child(data.path);
  console.log('Reading firebase object at path: ' + messageRef.toString());
  messageRef.once('value', function(messageData) {

    // Retrieved the message and uppercase it.
    console.log('Retrieved message content: ' + JSON.stringify(messageData.val()));
    var uppercased = messageData.val().text.toUpperCase();

    // Saving the uppercased message to DB.
    console.log('Saving uppercased message: ' + uppercased);
    messageRef.update({text: uppercased}, context.done);

  }, context.done);
};
// [END function]


// [START auth_user_start]
// Makes all new messages ALL UPPERCASE.
// We impersonate the user who has made the change that triggered the function.
exports.makeuppercaseuserauth = function(context, data) {

  // Authorize to the Firebase Database as the user if possible.
  if (data.authToken) {

    // Create a Database reference that's specific to the user token.
    var userAuthRef = new Firebase(env.get('firebase.database.url'), data.authToken);

    userAuthRef.authWithCustomToken(data.authToken, function (error, result) {
      if (error) {
        context.done(error);
      } else {
        console.log('Authorized successfully with payload: ', result.auth);
// [END auth_user_start]

        // Read the Firebase database object that triggered the function.
        var messageRef = userAuthRef.child(data.path);
        console.log('Reading firebase object at path: ' + messageRef.toString());
        messageRef.once('value', function(messageData) {

          // Retrieved the message and uppercase it.
          console.log('Retrieved message content: ' + JSON.stringify(messageData.val()));
          var uppercased = messageData.val().text.toUpperCase();

          // Saving the uppercased message to DB.
          console.log('Saving uppercased message: ' + uppercased);
          messageRef.update({text: uppercased}, context.done);

        }, context.done);
// [START auth_user_end]
      }
    });

  } else {
    console.log('User has not signed in. Lets try unauthenticated.');
    exports.makeuppercase(context, data);
  }
};
// [END auth_user_end]


// [START auth_admin]
// Firebase Database reference with admin authorization.
var adminAuthRef = new Firebase(env.get('firebase.database.url'), 'admin');

// Authorize to the Firebase Database with admin credentials.
adminAuthRef.authWithCustomToken(env.get('firebase.database.secret'));

// Makes all new messages ALL UPPERCASE.
// We authorize to the database as an admin.
exports.makeuppercaseadminauth = function(context, data) {

  // Read the Firebase database object that triggered the function.
  var messageRef = adminAuthRef.child(data.path);
  console.log('Reading firebase object at path: ' + messageRef.toString());
  messageRef.once('value', function(messageData) {

    // Retrieved the message and uppercase it.
    console.log('Retrieved message content: ' + JSON.stringify(messageData.val()));
    var uppercased = messageData.val().text.toUpperCase();

    // Saving the uppercased message to DB.
    console.log('Saving uppercased message: ' + uppercased);
    messageRef.update({text: uppercased}, context.done);

  }, context.done);
};
// [END auth_admin]
