import { firebaseConfig } from '../config';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, connectAuthEmulator } from 'firebase/auth';

initializeApp(firebaseConfig);

const auth = getAuth();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (auth.currentUser) {
    auth.signOut();
  } else {
    signInAnonymously(auth).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/operation-not-allowed') {
        alert('You must enable Anonymous auth in the Firebase Console.');
      } else {
        console.error(error);
      }
    });
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

// Listening for auth state changes.
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    document.getElementById('quickstart-sign-in-status').textContent =
      'Signed in';
    document.getElementById('quickstart-sign-in').textContent = 'Sign out';
    document.getElementById('quickstart-account-details').textContent =
      JSON.stringify(user, null, '  ');
  } else {
    // User is signed out.
    document.getElementById('quickstart-sign-in-status').textContent =
      'Signed out';
    document.getElementById('quickstart-sign-in').textContent = 'Sign in';
    document.getElementById('quickstart-account-details').textContent = 'null';
  }
  document.getElementById('quickstart-sign-in').disabled = false;
});

document
  .getElementById('quickstart-sign-in')
  .addEventListener('click', toggleSignIn, false);
