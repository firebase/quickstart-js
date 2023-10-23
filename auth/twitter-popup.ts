import { initializeApp } from 'firebase/app';
import {
  TwitterAuthProvider,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const accountDetails = document.getElementById(
  'quickstart-account-details',
) as HTMLDivElement;
const oauthsecret = document.getElementById(
  'quickstart-oauthsecret',
) as HTMLDivElement;
const oauthtoken = document.getElementById(
  'quickstart-oauthtoken',
) as HTMLDivElement;
const signInButton = document.getElementById(
  'quickstart-sign-in',
) as HTMLButtonElement;
const signInStatus = document.getElementById(
  'quickstart-sign-in-status',
) as HTMLDivElement;

/**
 * Function called when clicking the Login/Logout button.
 */
function toggleSignIn() {
  if (!auth.currentUser) {
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then(function (result) {
        const credential = TwitterAuthProvider.credentialFromResult(result);
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const token = credential?.accessToken;
        const secret = credential?.secret;
        // The signed-in user info.
        const user = result.user;
        oauthtoken.textContent = token ?? '';
        oauthsecret.textContent = secret ?? '';
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
  } else {
    signOut(auth);
  }
  signInButton.disabled = true;
}

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
    signInButton.textContent = 'Sign in with Twitter';
    accountDetails.textContent = 'null';
    oauthtoken.textContent = 'null';
    oauthsecret.textContent = 'null';
  }
  signInButton.disabled = false;
});

signInButton.addEventListener('click', toggleSignIn, false);
