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

var Firebase = require('firebase');

exports.helloworld = function(context, data) {
  console.log("It works! ");
  context.done();
};

// Moderators messages by lowering all uppercase characters
exports.moderator = function(context, data) {
  // Read the Firebase DB entry that triggered the function.
  var newMessageRef = new Firebase(data.path);
  newMessageRef.once('value', function(data) {
    var firebaseEntryValues = data.val();
    var message = firebaseEntryValues.message;
    // Stop if the message has already been moderated. We need this until we can filter Cloud Functions by "child_created" events only.
    if (firebaseEntryValues.moderated) {
      return context.done();
    }
    // Moderate if the user is Yelling.
    if (message.isYelling()) {
      firebaseEntryValues.message = message.capitalizeSentence();
      firebaseEntryValues.moderated = true;
    }
    // Moderate if the user uses SwearWords.
    if (message.hasSwearWords()) {
      firebaseEntryValues.message = message.moderateSwearWords();
      firebaseEntryValues.moderated = true;
    }
    // If message has just been moderated we update the Firebase DB.
    if(firebaseEntryValues.moderated) {
      newMessageRef.update(firebaseEntryValues, function(error) {
        error ? context.done(error) : context.done();
      });
    } else {
      context.done();
    }
  }, function(error) {
    context.done(error);
  });
};

/**** String Moderation functions ****/

var swearWords = ['crap', 'damit', 'poop']; // Add whatever blacklisted words you can think of.

// Detect if the current message contains swearwords.
String.prototype.hasSwearWords = function() {
  for (var i = 0; i < swearWords.length; i++) {
    if (this.toLowerCase().indexOf(swearWords[i].toLowerCase()) !== -1) {
      return true;
    }
  }
  return false;
};

// Hide all swearwords. e.g: Crap => C***
String.prototype.moderateSwearWords = function() {
  for (var i = 0; i < swearWords.length; i++) {
    var moderated = '' + swearWords.charAt(0);
    for (var j = 1; j < swearWords[i].length; j++) {
      moderated += '*';
    }
    this.replace(/swearWords[i]/ig, moderated);
  }
  return false;
};

// Detect if the current message is yelling.
String.prototype.isYelling = function() {
  return this === this.toUpperCase();
};

// Correctly capitalize the string as a sentence (e.g. uppercase after dots).
String.prototype.capitalizeSentence = function() {
  return this.replace(/.+?[\.\?\!](\s|$)/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  });
};
