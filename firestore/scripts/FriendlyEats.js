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

// shortcuts to DOM elements
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');

// console log fid for debugging
firebase.installations().getId().then(token => console.log('fid is', token));

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Signs-in Friendly Chat.
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    firebase.analytics().setUserId(user.email);
    firebase.analytics().logEvent("login", { method: 'google' });
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // enable notifications after log in.
   // initMessaging();
  } else { // User is signed out!
    firebase.analytics().logEvent('logout');
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  firebase.analytics().logEvent('request_notification_permission');
  firebase.messaging().requestPermission().then(function () {
    // Notification permission granted.
    firebase.analytics().logEvent('notification_permission_granted');
  }).catch(function (error) {
    console.error('Unable to get permission to notify.', error);
    firebase.analytics().logEvent('notification_permission_denied');
  });
}

function initRemoteConfig() {
  const remoteConfig = firebase.remoteConfig();
  remoteConfig.settings.minimumFetchIntervalMillis = 0;

  remoteConfig.fetchAndActivate().then(() => {
    const dark = remoteConfig.getBoolean('dark');
    if (dark) {
        const body = document.getElementById('body-div');
        const header = document.getElementById('site-header');
        const filter = document.getElementById('filter')
        body.style.backgroundColor = 'black';
        header.style.backgroundColor = 'darkorange';
        filter.style.backgroundColor = 'darkorange';
    }
  });
}

/**
 * Initializes the FriendlyEats app.
 */
function FriendlyEats() {
  this.filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
  };

  this.dialogs = {};
  this.snackbars = {};

  var that = this;
  // init unfinished review dialog
  this.dialogs.unfinshedReview = new mdc.dialog.MDCDialog(document.querySelector('#dialog-unfinished-review'));

  // init firebase anaytics
  firebase.analytics();

  // init remote config
  initRemoteConfig();

  // init initFCM
  this.initFCM();

  // init firebase auth
  initFirebaseAuth();

  firebase.firestore().enablePersistence({ synchronizeTabs: true })
    .then(function () {
      that.initTemplates();
      that.initRouter();
      that.initReviewDialog();
      that.initFilterDialog();
      that.initMustSignInSnackBar();
      that.initUnfinishedSnackBar();
      // show welcome dialog if user had unfinished review
      that.showUnfinsihedDialog();
      // that.showUnfinsihedSnackBar();
    }).catch(function (err) {
      console.log(err);
    });
}

FriendlyEats.prototype.showUnfinsihedDialog = function () {
  const that = this;
  const remoteConfig = firebase.remoteConfig();
  remoteConfig.fetchAndActivate().then(() => {
    const unfinished = remoteConfig.getBoolean('unfinished_reviews');
    if (unfinished) {
      that.dialogs.unfinshedReview.show();
    }
  });
}

FriendlyEats.prototype.showUnfinsihedSnackBar = function() {
  const remoteConfig = firebase.remoteConfig()
  remoteConfig.fetchAndActivate().then(() => {
    const unfinished = remoteConfig.getBoolean('unfinished_reviews');
    if (unfinished) {
      this.snackbars.welcome_unfinished_review.show({
        message: 'Welcome back! We would love it if you could finish the review.',
        timeout: 5000
      });
    }
  });
}
/**
 * Initialize FCM
 */
FriendlyEats.prototype.initFCM = function() {
  const that = this;
  firebase.messaging().getToken().then(function (currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch(function (error) {
    console.error('Unable to get messaging token.', error);
  });

  firebase.messaging().onMessage(payload => {
    console.log('Message received. ', payload);
    // fire analytics event
    firebase.analytics().logEvent('notification_received');

    // show welcome dialog if user had unfinished review
    // that.showUnfinsihedDialog();
    that.showUnfinsihedSnackBar();
  });
}

/**
 * Initializes the router for the FriendlyEats app.
 */
FriendlyEats.prototype.initRouter = function () {
  this.router = new Navigo();

  var that = this;
  this.router
    .on({
      '/': function () {
        that.updateQuery(that.filters);
      }
    })
    .on({
      '/setup': function () {
        that.viewSetup();
      }
    })
    .on({
      '/restaurants/*': function () {
        var path = that.getCleanPath(document.location.pathname);
        var id = path.split('/')[2];
        that.viewRestaurant(id);
      }
    })
    .resolve();

  firebase
    .firestore()
    .collection('restaurants')
    .limit(1)
    .onSnapshot(function (snapshot) {
      if (snapshot.empty) {
        that.router.navigate('/setup');
      }
    });
};

FriendlyEats.prototype.getCleanPath = function (dirtyPath) {
  if (dirtyPath.startsWith('/index.html')) {
    return dirtyPath.split('/').slice(1).join('/');
  } else {
    return dirtyPath;
  }
};

FriendlyEats.prototype.getFirebaseConfig = function () {
  return firebase.app().options;
};

FriendlyEats.prototype.getRandomItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

FriendlyEats.prototype.data = {
  words: [
    'Bar',
    'Fire',
    'Grill',
    'Drive Thru',
    'Place',
    'Best',
    'Spot',
    'Prime',
    'Eatin\''
  ],
  cities: [
    'Albuquerque',
    'Arlington',
    'Atlanta',
    'Austin',
    'Baltimore',
    'Boston',
    'Charlotte',
    'Chicago',
    'Cleveland',
    'Colorado Springs',
    'Columbus',
    'Dallas',
    'Denver',
    'Detroit',
    'El Paso',
    'Fort Worth',
    'Fresno',
    'Houston',
    'Indianapolis',
    'Jacksonville',
    'Kansas City',
    'Las Vegas',
    'Long Island',
    'Los Angeles',
    'Louisville',
    'Memphis',
    'Mesa',
    'Miami',
    'Milwaukee',
    'Nashville',
    'New York',
    'Oakland',
    'Oklahoma',
    'Omaha',
    'Philadelphia',
    'Phoenix',
    'Portland',
    'Raleigh',
    'Sacramento',
    'San Antonio',
    'San Diego',
    'San Francisco',
    'San Jose',
    'Tucson',
    'Tulsa',
    'Virginia Beach',
    'Washington'
  ],
  categories: [
    'Brunch',
    'Burgers',
    'Coffee',
    'Deli',
    'Dim Sum',
    'Indian',
    'Italian',
    'Mediterranean',
    'Mexican',
    'Pizza',
    'Ramen',
    'Sushi'
  ],
  ratings: [
    {
      rating: 1,
      text: 'Would never eat here again!'
    },
    {
      rating: 2,
      text: 'Not my cup of tea.'
    },
    {
      rating: 3,
      text: 'Exactly okay :/'
    },
    {
      rating: 4,
      text: 'Actually pretty good, would recommend!'
    },
    {
      rating: 5,
      text: 'This is my favorite place. Literally.'
    }
  ],
  descriptions: [
    'A seafood restaurant in Sea World',
    'Bacon is red, steak can be blue',
    `World's leading restaurant of fried chicken`,
    'Open bar every Monday 7am - 9am',
    'The finest Pizzeria in town',
    'Authentic NY-style bagels with real cream cheese',
    `We don't take reservations`,
    'Absolute Guest Satisfaction.',
    'A restaurant with a mission to end world hunger',
    'Great food, big portions and cheap prices',
    'Chic restaurant that offers karaoke'
  ]
};

window.onload = function () {
  window.app = new FriendlyEats();
};
