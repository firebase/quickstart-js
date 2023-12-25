import { initializeApp } from 'firebase/app';
import {
  TotpMultiFactorGenerator,
  TotpSecret,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  getMultiFactorResolver,
  multiFactor,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { firebaseConfig } from './config';
import { get } from 'firebase/database';

initializeApp(firebaseConfig);

const auth = getAuth();

// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://127.0.0.1:9099');
// }
let totpSecret: TotpSecret | null = null;
const emailInput = document.getElementById('email')! as HTMLInputElement;
const passwordInput = document.getElementById('password')! as HTMLInputElement;
const totpInput = document.getElementById('totp')! as HTMLInputElement;
const totpButton = document.getElementById(
  'quickstart-enable-totp',
)! as HTMLButtonElement;
const signInButton = document.getElementById(
  'quickstart-sign-in',
)! as HTMLButtonElement;
const signUpButton = document.getElementById(
  'quickstart-sign-up',
)! as HTMLButtonElement;
const passwordResetButton = document.getElementById(
  'quickstart-password-reset',
)! as HTMLButtonElement;
const verifyEmailButton = document.getElementById(
  'quickstart-verify-email',
)! as HTMLButtonElement;
const signInStatus = document.getElementById(
  'quickstart-sign-in-status',
)! as HTMLSpanElement;
const accountDetails = document.getElementById(
  'quickstart-account-details',
)! as HTMLDivElement;
const get2faQrCodeButton = document.getElementById(
  'quickstart-get-2fa-qr-code',
)! as HTMLButtonElement;
const qrCodeData = document.getElementById(
  'quickstart-qr-code-data',
)! as HTMLDivElement;

const totpEnable = async () => {
  const user = auth.currentUser;
  if (!user) {
    return;
  }
  const verificationCode = totpInput.value;
  if (!totpSecret || !verificationCode) {
    return;
  }
  await enrollMultiFactor(totpSecret, verificationCode);
};

const enrollMultiFactor = async (
  totpSecret: TotpSecret,
  verificationCode: string,
) => {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }

  const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
    totpSecret,
    verificationCode,
  );

  await multiFactor(user).enroll(multiFactorAssertion, 'TOTP 2FA');
  return true;
};

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (error.code === 'auth/multi-factor-auth-required') {
        const code = prompt('Enter the 6 digit code from your authenticator app.');
        const resolver = getMultiFactorResolver(auth, error);
        const selectedMFA = resolver.hints[0];
        if (selectedMFA.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
          const multiFactorAssertion =
            TotpMultiFactorGenerator.assertionForSignIn(selectedMFA.uid, code || '');
          return resolver.resolveSignIn(multiFactorAssertion);
        }
      } else if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      signInButton.disabled = false;
    });
  }
  signInButton.disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Create user with email and pass.
  createUserWithEmailAndPassword(auth, email, password).catch(function (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

/**
 * Sends an email verification to the user.
 */
function sendVerificationEmailToUser() {
  sendEmailVerification(auth.currentUser!).then(function () {
    // Email Verification sent!
    alert('Email Verification Sent!');
  });
}

function sendPasswordReset() {
  const email = emailInput.value;
  sendPasswordResetEmail(auth, email)
    .then(function () {
      // Password Reset Email Sent!
      alert('Password Reset Email Sent!');
    })
    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
    });
}

const generateMultiFactorSecret = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  const multiFactorSession = await multiFactor(user).getSession();
  totpSecret =
    await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
  return totpSecret;
};

const generateMultiFactorQrCode = async (totpSecret: TotpSecret) => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  let url = totpSecret.generateQrCodeUrl(user.email || '', 'test-2fa-issue');
  url = url.replace('&algorithm=HMACSHA1', '');
  return url;
};

const get2faQrCode = async () => {
  const totpSecret = await generateMultiFactorSecret();
  if (!totpSecret) {
    return null;
  }
  const qrCode = await generateMultiFactorQrCode(totpSecret);
  if (!qrCode) {
    return null;
  }
  qrCodeData.textContent = JSON.stringify(qrCode, null, '  ');
};

// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
  verifyEmailButton.disabled = true;
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
    if (!emailVerified) {
      verifyEmailButton.disabled = false;
    }
  } else {
    // User is signed out.
    signInStatus.textContent = 'Signed out';
    signInButton.textContent = 'Sign in';
    accountDetails.textContent = 'null';
  }
  signInButton.disabled = false;
});

totpButton.addEventListener('click', totpEnable, false);
signInButton.addEventListener('click', toggleSignIn, false);
signUpButton.addEventListener('click', handleSignUp, false);
verifyEmailButton.addEventListener('click', sendVerificationEmailToUser, false);
passwordResetButton.addEventListener('click', sendPasswordReset, false);
get2faQrCodeButton.addEventListener('click', get2faQrCode, false);
