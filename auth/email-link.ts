import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAdditionalUserInfo,
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
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
const emailInput = document.getElementById('email')! as HTMLInputElement;
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
  // Disable the sign-in button during async sign-in tasks.
  signInButton.disabled = true;

  if (auth.currentUser) {
    signOut(auth).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      handleError(error);
    });
  } else {
    const email = emailInput.value;
    // Sending email with sign-in link.
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this URL
      // must be whitelisted in the Firebase Console.
      url: window.location.href, // Here we redirect back to this same page.
      handleCodeInApp: true, // This must be true.
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(function () {
        // Save the email locally so you don’t need to ask the user for it again if they open
        // the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        // The link was successfully sent. Inform the user.
        alert(
          'An email was sent to ' +
            email +
            '. Please use the link in the email to sign-in.',
        );
        // Re-enable the sign-in button.
        signInButton.disabled = false;
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        handleError(error);
      });
  }
}

/**
 * Handles Errors from various Promises..
 */
function handleError(error: any) {
  // Display Error.
  alert('Error: ' + error.message);
  console.log(error);
  // Re-enable the sign-in button.
  signInButton.disabled = false;
}

/**
 * Handles automatically signing-in the app if we clicked on the sign-in link in the email.
 */
function handleSignIn() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Disable the sign-in button during async sign-in tasks.
    signInButton.disabled = true;

    // You can also get the other parameters passed in the query string such as state=STATE.
    // Get the email if available.
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation attacks, ask the
      // user to provide the associated email again. For example:
      email = window.prompt(
        "Please provide the email you'd like to sign-in with for confirmation.",
      );
    }
    if (email) {
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then(function (result) {
          // Clear the URL to remove the sign-in link parameters.
          window.history.replaceState(
            {},
            document.title,
            window.location.href.split('?')[0],
          );
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // Signed-in user's information.
          const user = result.user;
          const additionalUserInfo = getAdditionalUserInfo(result);
          const isNewUser = additionalUserInfo?.isNewUser;
          console.log(result);
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          handleError(error);
        });
    }
  }
}

// Restore the previously used value of the email.
const email = window.localStorage.getItem('emailForSignIn');
emailInput.value = email ?? '';

// Automatically signs the user-in using the link.
handleSignIn();

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
    // Update UI.
    signInStatus.textContent = 'Signed in';
    signInButton.textContent = 'Sign out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
  } else {
    // User is signed out.
    // Update UI.
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Sign In without password';
    accountDetails.textContent = 'null';
  }
  signInButton.disabled = false;
});

signInButton.addEventListener('click', toggleSignIn, false);
