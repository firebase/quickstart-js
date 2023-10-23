import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const tokenTextArea = document.getElementById(
  'tokentext',
)! as HTMLTextAreaElement;
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
 * Handle the sign in button press.
 */
function toggleSignIn() {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    const token = tokenTextArea.value;
    if (token.length < 10) {
      alert('Please enter a token in the text area');
      return;
    }
    // Sign in with custom token generated following previous instructions.
    signInWithCustomToken(auth, token).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/invalid-custom-token') {
        alert('The token you provided is not valid.');
      } else {
        console.error(error);
      }
    });
  }
  signInButton.disabled = true;
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in.
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const photoURL = user.photoURL;
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    const providerData = user.providerData;
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

function getHashValue(key: string): string | null {
  const matches = location.hash.match(new RegExp(key + '=([^&]*)'));
  return matches ? matches[1] : null;
}

// If a token has been passed in the hash fragment we display it in the UI and start the sign in process.
tokenTextArea.value = getHashValue('token') || '';
if (tokenTextArea.value) {
  signInWithCustomToken(auth, tokenTextArea.value);
}
