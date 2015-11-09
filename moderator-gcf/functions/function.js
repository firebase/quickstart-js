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

var Firebase = require('firebase');
var config = require('./config.json');
var stringUtils = require('./moderation-string-utils.js');
stringUtils.loadModerationStringUtils();

// Moderates messages by lowering all uppercase messages and removing swearwords.
exports.moderator = function(context, data) {

  // Read the Firebase DB entry that triggered the function.
  console.log('Loading firebase path: ' + config.firebaseDbUrl + data.path);
  var messageFirebaseDbRef = new Firebase(config.firebaseDbUrl + data.path);
  messageFirebaseDbRef.once('value', function(fbData) {

    // Retrieved the message values.
    console.log('Got message content: ' + JSON.stringify(fbData.val()));
    var messageEntryData = fbData.val();

    // Abort if the message has already been moderated. We need this until we can filter Cloud
    // Functions by "child_created" events only.
    // TODO: Remove this when we can filter on "child_created" events.
    if (messageEntryData.moderated) {
      return context.done();
    }

    // Run moderation checks on on the message and moderate if needed.
    var moderatedMessage = moderateMessage(messageEntryData.message, context, messageFirebaseDbRef);

    // If message has just been moderated we update the Firebase DB.
    if (messageEntryData.message != moderatedMessage) {
      console.log('Message has been moderated. Saving to DB: ' + moderatedMessage);
      // TODO: Authorize when we can use custom auth on GCF.
      messageFirebaseDbRef.update({message: moderatedMessage, moderated: true}, function (error) {
        context.done(error);
      });
    } else {
      context.done();
    }

  // If reading the Firebase DB failed.
  }, function(error) {
    context.done(error);
  });
};

// Moderates the given message if needed.
function moderateMessage(message) {

  // Moderate if the user is Yelling.
  if (message.isYelling()) {
    console.log('User is yelling. moderating...');
    message = message.capitalizeSentence();
  }

  // Moderate if the user uses SwearWords.
  if (message.containsSwearwords()) {
    console.log('User is swearing. moderating...');
    message = message.moderateSwearwords();
  }

  return message;
}
