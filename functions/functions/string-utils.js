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

/**** String Moderation functions ****/

exports.loadModeratorStringUtils = function() {

  var swearWords = ['crap', 'damit', 'poop']; // Add whatever blacklisted words you can think of.

  // Detect if the current message contains swearwords.
  String.prototype.hasSwearWords = function () {
    for (var i = 0; i < swearWords.length; i++) {
      if (this.toLowerCase().indexOf(swearWords[i].toLowerCase()) !== -1) {
        return true;
      }
    }
    return false;
  };

  // Hide all swearwords. e.g: Crap => C***
  String.prototype.moderateSwearWords = function () {
    var moderated = this;
    for (var i = 0; i < swearWords.length; i++) {
      var hidden = '' + swearWords[i].charAt(0);
      for (var j = 1; j < swearWords[i].length; j++) {
        hidden += '*';
      }
      var regexp = new RegExp(swearWords[i], "ig");
      moderated = moderated.replace(regexp, hidden);
    }
    return moderated;
  };

  // Detect if the current message is yelling. i.e. there are too many Uppercase
  // characters.
  String.prototype.isYelling = function () {
    return this.replace(/[^A-Z]/g, '').length > this.length / 2
      || this.replace(/[^!]/g, '').length >= 3;
  };

  // Correctly capitalize the string as a sentence (e.g. uppercase after dots) and
  // remove exclamation points.
  String.prototype.capitalizeSentence = function () {
    var sentence = this.toLowerCase().match(/[^\.!\?]+[\.!\?]+/g);
    if (!sentence) {
      sentence = [this.toLowerCase()];
    }
    var out = '';
    sentence.forEach(function (entry) {
      entry = entry.trim();
      entry = entry.substring(0, 1).toUpperCase() + entry.substring(1);
      out += entry + ' ';
    });
    return out.trim().replace(/!+/g, '.');
  };
}
