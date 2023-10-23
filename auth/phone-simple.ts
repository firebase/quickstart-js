import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

const signInButton = document.getElementById(
  'sign-in-button',
) as HTMLButtonElement;
const signOutButton = document.getElementById(
  'sign-out-button',
) as HTMLButtonElement;
const signInStatus = document.getElementById(
  'sign-in-status',
) as HTMLSpanElement;
const accountDetails = document.getElementById(
  'account-details',
) as HTMLDivElement;

/**
 * Function called when clicking the Login/Logout button.
 */
function onSignInClick() {
  window.open(
    'phone-simple-popup.html',
    '_blank',
    'height=600px,width=450px,top=100px,left=100px',
  );
}

/**
 * Signs out the user when the sign-out button is clicked.
 */
function onSignOutClick() {
  signOut(auth);
}

/**
 * Updates the state of the Sign-in form.
 */
function updateSignInButtonUI() {
  if (auth.currentUser) {
    signInButton.style.display = 'none';
  } else {
    signInButton.style.display = 'block';
  }
}

/**
 * Updates the state of the Sign out button.
 */
function updateSignOutButtonUI() {
  if (auth.currentUser) {
    signOutButton.style.display = 'block';
  } else {
    signOutButton.style.display = 'none';
  }
}

/**
 * Updates the Signed in user status panel.
 */
function updateSignedInUserStatusUI() {
  const user = auth.currentUser;
  if (user) {
    signInStatus.textContent = 'Signed in';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
  } else {
    signInStatus.textContent = 'Signed out';
    accountDetails.textContent = 'null';
  }
}

// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in.
    const uid = user.uid;
    const email = user.email;
    const photoURL = user.photoURL;
    const phoneNumber = user.phoneNumber;
    const isAnonymous = user.isAnonymous;
    const displayName = user.displayName;
    const providerData = user.providerData;
    const emailVerified = user.emailVerified;
  }
  updateSignInButtonUI();
  updateSignOutButtonUI();
  updateSignedInUserStatusUI();
});

// Event bindings.
signInButton.addEventListener('click', onSignInClick);
signOutButton.addEventListener('click', onSignOutClick);
