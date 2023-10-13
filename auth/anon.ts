import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  connectAuthEmulator,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

initializeApp(firebaseConfig);

const auth = getAuth();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const signInButton = document.getElementById(
  'quickstart-sign-in',
)! as HTMLButtonElement;
const signInStatus = document.getElementById(
  'quickstart-sign-in-status',
)! as HTMLSpanElement;
const accountDetails = document.getElementById(
  'quickstart-account-details',
)! as HTMLDivElement;

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    signInAnonymously(auth).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/operation-not-allowed') {
        alert('You must enable Anonymous auth in the Firebase Console.');
      } else {
        console.error(error);
      }
    });
  }
  signInButton.disabled = true;
}

// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in.
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    signInStatus.textContent = 'Signed in';
    signInButton.textContent = 'Sign out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
  } else {
    // User is signed out.
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Sign in';
    accountDetails.textContent = 'null';
  }
  signInButton.disabled = false;
});

signInButton.addEventListener('click', toggleSignIn, false);
