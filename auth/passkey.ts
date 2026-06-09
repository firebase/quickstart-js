import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signOut,
  enrollPasskey,
  signInWithPasskey,
  unenrollPasskey,
  reload,
  User,
} from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

// Connect to the local emulator for testing.
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

const signinNameInput = document.getElementById('signin-passkey-name')! as HTMLInputElement;
const signInButton = document.getElementById('quickstart-sign-in')! as HTMLButtonElement;

const enrollNameInput = document.getElementById('enroll-passkey-name')! as HTMLInputElement;
const enrollButton = document.getElementById('quickstart-enroll-passkey')! as HTMLButtonElement;

const getEnrolledButton = document.getElementById('quickstart-get-enrolled-passkeys')! as HTMLButtonElement;

const unenrollIdInput = document.getElementById('unenroll-passkey-credential-id')! as HTMLInputElement;
const unenrollButton = document.getElementById('quickstart-unenroll-passkey')! as HTMLButtonElement;

const signInStatus = document.getElementById('quickstart-sign-in-status')! as HTMLSpanElement;
const accountDetails = document.getElementById('quickstart-account-details')! as HTMLDivElement;

/**
 * Handles the sign in button press.
 */
function handleSignIn() {
  if (auth.currentUser) {
    signOut(auth).catch(function (error) {
      alert(error.message);
    });
  } else {
    const name = signinNameInput.value;
    if (name.length < 1) {
      alert('Please enter a passkey name.');
      return;
    }
    signInButton.disabled = true;
    signInWithPasskey(auth, name)
      .catch(function (error) {
        alert(error.message);
        console.error(error);
        signInButton.disabled = false;
      });
  }
}

/**
 * Handles the enroll button press.
 */
function handleEnroll() {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be signed in to enroll a passkey.');
    return;
  }
  const name = enrollNameInput.value;
  if (name.length < 1) {
    alert('Please enter a passkey label/name.');
    return;
  }
  enrollButton.disabled = true;
  enrollPasskey(user, name)
    .then(function () {
      alert('Passkey enrolled successfully!');
      return reload(user);
    })
    .then(function () {
      updateAccountDetails(user);
      enrollButton.disabled = false;
      enrollNameInput.value = '';
    })
    .catch(function (error) {
      alert(error.message);
      console.error(error);
      enrollButton.disabled = false;
    });
}
function handleGetEnrolled() {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be signed in to get enrolled passkeys.');
    return;
  }
  getEnrolledButton.disabled = true;
  reload(user)
    .then(function () {
      updateAccountDetails(user);
      const passkeys = (user as any).enrolledPasskeys || [];
      if (passkeys.length === 0) {
        alert('No passkeys enrolled for this user.');
      } else {
        const listStr = passkeys
          .map((pk: any) => `Name: ${pk.name || 'Unnamed'}, Credential ID: ${pk.credentialId}`)
          .join('\n');
        alert(`Enrolled Passkeys:\n${listStr}`);
      }
      getEnrolledButton.disabled = false;
    })
    .catch(function (error) {
      alert(error.message);
      getEnrolledButton.disabled = false;
    });
}

/**
 * Handles unenroll button press.
 */
function handleUnenroll() {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be signed in to unenroll a passkey.');
    return;
  }
  const credentialId = unenrollIdInput.value;
  if (credentialId.length < 1) {
    alert('Please enter a credential ID.');
    return;
  }
  unenrollButton.disabled = true;
  unenrollPasskey(user, credentialId)
    .then(function () {
      alert('Passkey unenrolled successfully!');
      return reload(user);
    })
    .then(function () {
      updateAccountDetails(user);
      unenrollButton.disabled = false;
      unenrollIdInput.value = '';
    })
    .catch(function (error) {
      alert(error.message);
      console.error(error);
      unenrollButton.disabled = false;
    });
}

/**
 * Updates the displayed account details.
 */
function updateAccountDetails(user: User | null) {
  if (user) {
    // User is signed in.
    signInStatus.textContent = 'Signed in';
    signInButton.textContent = 'Sign out';
    signInButton.disabled = false;
    const userJson = {
      ...user.toJSON(),
      enrolledPasskeys: (user as any).enrolledPasskeys || [],
    };
    accountDetails.textContent = JSON.stringify(userJson, null, '  ');
    
    // Enable enroll/unenroll buttons
    enrollButton.disabled = false;
    getEnrolledButton.disabled = false;
    unenrollButton.disabled = false;
  } else {
    // User is signed out.
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Sign in';
    signInButton.disabled = false;
    accountDetails.textContent = 'null';
    
    // Disable enroll/unenroll buttons
    enrollButton.disabled = true;
    getEnrolledButton.disabled = true;
    unenrollButton.disabled = true;
  }
}

// Listening for auth state changes.
onAuthStateChanged(auth, updateAccountDetails);

signInButton.addEventListener('click', handleSignIn, false);
enrollButton.addEventListener('click', handleEnroll, false);
getEnrolledButton.addEventListener('click', handleGetEnrolled, false);
unenrollButton.addEventListener('click', handleUnenroll, false);
