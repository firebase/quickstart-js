import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';
import {
  OAuthProvider,
  connectAuthEmulator,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';

initializeApp(firebaseConfig);

const auth = getAuth();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

/**
 * Function called when clicking the Login/Logout button.
 */
function toggleSignIn() {
  if (!auth.currentUser) {
    var provider = new OAuthProvider('apple.com');

    provider.addScope('email');
    provider.addScope('name');

    signInWithPopup(auth, provider)
      .then(function (result) {
        // The signed-in user info.
        var user = result.user;

        const credential = OAuthProvider.credentialFromResult(result)!;
        // You can also get the Apple OAuth Access and ID Tokens.
        var accessToken = credential.accessToken;
        var idToken = credential.idToken;

        document.getElementById('quickstart-oauthtoken').textContent = idToken;
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert(
            'You have already signed up with a different auth provider for that email.'
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
  document.getElementById('quickstart-sign-in').disabled = true;
}

// Listening for auth state changes.
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in. Note that unlike other providers supported by Firebase Auth, Apple does
    // not provide a profile photo so user.photoURL will be null.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    document.getElementById('quickstart-sign-in-status').textContent =
      'Signed in';
    document.getElementById('quickstart-sign-in').textContent = 'Log out';
    document.getElementById('quickstart-account-details').textContent =
      JSON.stringify(user, null, '  ');
  } else {
    // User is signed out.
    document.getElementById('quickstart-sign-in-status').textContent =
      'Signed out';
    document.getElementById('quickstart-sign-in').textContent =
      'Log in with Apple';
    document.getElementById('quickstart-account-details').textContent = 'null';
    document.getElementById('quickstart-oauthtoken').textContent = 'null';
  }
  document.getElementById('quickstart-sign-in').disabled = false;
});

document
  .getElementById('quickstart-sign-in')
  .addEventListener('click', toggleSignIn, false);
