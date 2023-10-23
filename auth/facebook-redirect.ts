import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  connectAuthEmulator,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const signInButton = document.getElementById(
  'quickstart-sign-in',
)! as HTMLButtonElement;
const oauthToken = document.getElementById(
  'quickstart-oauthtoken',
)! as HTMLDivElement;
const signInStatus = document.getElementById(
  'quickstart-sign-in-status',
)! as HTMLSpanElement;
const accountDetails = document.getElementById(
  'quickstart-account-details',
)! as HTMLDivElement;

/**
 * Function called when clicking the Login/Logout button.
 */
function toggleSignIn() {
  if (!auth.currentUser) {
    const provider = new FacebookAuthProvider();
    provider.addScope('user_likes');
    signInWithRedirect(auth, provider);
  } else {
    signOut(auth);
  }
  signInButton.disabled = true;
}

// Result from Redirect auth flow.
getRedirectResult(auth)
  .then(function (result) {
    if (!result) return;
    const credential = FacebookAuthProvider.credentialFromResult(result);
    if (credential) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const token = credential.accessToken;
      oauthToken.textContent = token ?? '';
    } else {
      oauthToken.textContent = 'null';
    }
    // The signed-in user info.
    const user = result.user;
  })
  .catch(function (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
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
    signInButton.textContent = 'Log out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
  } else {
    // User is signed out.
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Log in with Facebook';
    accountDetails.textContent = 'null';
    oauthToken.textContent = 'null';
  }
  signInButton.disabled = false;
});

signInButton.addEventListener('click', toggleSignIn, false);
