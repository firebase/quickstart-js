import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';
import {
  OAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
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
const oauthToken = document.getElementById(
  'quickstart-oauthtoken',
)! as HTMLDivElement;

/**
 * Function called when clicking the Login/Logout button.
 */
function toggleSignIn() {
  if (!auth.currentUser) {
    const provider = new OAuthProvider('apple.com');

    provider.addScope('email');
    provider.addScope('name');

    signInWithPopup(auth, provider)
      .then(function (result) {
        // The signed-in user info.
        const user = result.user;

        const credential = OAuthProvider.credentialFromResult(result)!;
        // You can also get the Apple OAuth Access and ID Tokens.
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;

        oauthToken.textContent = idToken ?? null;
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert(
            'You have already signed up with a different auth provider for that email.',
          );
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
      });
  } else {
    auth.signOut();
  }
  signInButton.disabled = true;
}

// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in. Note that unlike other providers supported by Firebase Auth, Apple does
    // not provide a profile photo so user.photoURL will be null.
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    const providerData = user.providerData;
    signInStatus.textContent = 'Signed in';
    signInButton.textContent = 'Log out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
  } else {
    // User is signed out.
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Log in with Apple';
    accountDetails.textContent = 'null';
    oauthToken.textContent = 'null';
  }
  signInButton.disabled = false;
});

signInButton.addEventListener('click', toggleSignIn, false);
