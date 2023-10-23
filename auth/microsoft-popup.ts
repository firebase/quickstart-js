import { initializeApp } from 'firebase/app';
import {
  OAuthProvider,
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
    const provider = new OAuthProvider('microsoft.com');

    provider.addScope('User.Read');
    signInWithPopup(auth, provider)
      .then(function (result) {
        const credential = OAuthProvider.credentialFromResult(result);
        // This gives you a Microsoft Access Token. You can use it to access the Microsoft API.
        const token = credential?.accessToken;
        // You can also retrieve the OAuth ID token.
        const idToken = credential?.idToken;
        // The signed-in user info.
        const user = result.user;
        oauthToken.textContent = token ?? '';
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
    signOut(auth);
  }
  signInButton.disabled = true;
}

// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in. Note that unlike other providers supported by Firebase Auth, Microsoft does
    // not provide a profile photo so user.photoURL will be null. However, it can be queried using
    // the Microsoft Graph API: https://docs.microsoft.com/en-us/graph/api/profilephoto-get
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
    signInButton.textContent = 'Log in with Microsoft';
    accountDetails.textContent = 'null';
    oauthToken.textContent = 'null';
  }
  signInButton.disabled = false;
});

signInButton.addEventListener('click', toggleSignIn, false);
