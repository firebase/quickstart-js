import { initializeApp } from 'firebase/app';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

// reCAPTCHA verification does not work with the Firebase emulator.
// Hence, we do not connect to the emulator in this example.

// We declare variables used on the window object
// We use a custom interface to avoid these modifying the global Window type in other files
interface CustomWindow extends Window {
  signingIn?: boolean;
  verifyingCode?: boolean;
  confirmationResult?: ConfirmationResult | null;
  recaptchaVerifier?: RecaptchaVerifier;
  recaptchaWidgetId?: number;
}

declare const window: CustomWindow;

// Comes from Google reCAPTCHA V3 script included in the HTML file
declare const grecaptcha: any;

const phoneNumberInput = document.getElementById(
  'phone-number',
)! as HTMLInputElement;
const signInButton = document.getElementById(
  'sign-in-button',
)! as HTMLButtonElement;
const signInForm = document.getElementById('sign-in-form')! as HTMLFormElement;
const signOutButton = document.getElementById(
  'sign-out-button',
)! as HTMLButtonElement;
const verificationCodeForm = document.getElementById(
  'verification-code-form',
)! as HTMLFormElement;
const verificationCodeInput = document.getElementById(
  'verification-code',
)! as HTMLInputElement;
const verifyCodeButton = document.getElementById(
  'verify-code-button',
)! as HTMLButtonElement;
const signInStatus = document.getElementById(
  'sign-in-status',
)! as HTMLSpanElement;
const accountDetails = document.getElementById(
  'account-details',
)! as HTMLDivElement;
const cancelVerifyCodeButton = document.getElementById(
  'cancel-verify-code-button',
)! as HTMLButtonElement;

/**
 * Function called when clicking the Login/Logout button.
 */
function onSignInSubmit() {
  if (isPhoneNumberValid()) {
    window.signingIn = true;
    updateSignInButtonUI();
    const phoneNumber = getPhoneNumberFromUserInput();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier!)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        window.signingIn = false;
        updateSignInButtonUI();
        updateVerificationCodeFormUI();
        updateVerifyCodeButtonUI();
        updateSignInFormUI();
      })
      .catch(function (error) {
        // Error; SMS not sent
        console.error('Error during signInWithPhoneNumber', error);
        window.alert(
          'Error during signInWithPhoneNumber:\n\n' +
            error.code +
            '\n\n' +
            error.message,
        );
        window.signingIn = false;
        updateSignInFormUI();
        updateSignInButtonUI();
      });
  }
}

/**
 * Function called when clicking the "Verify Code" button.
 */
function onVerifyCodeSubmit(e: Event) {
  e.preventDefault();
  if (!!getCodeFromUserInput()) {
    window.verifyingCode = true;
    updateVerifyCodeButtonUI();
    const code = getCodeFromUserInput();
    window
      .confirmationResult!.confirm(code)
      .then(function (result) {
        // User signed in successfully.
        const user = result.user;
        window.verifyingCode = false;
        window.confirmationResult = null;
        updateVerificationCodeFormUI();
      })
      .catch(function (error) {
        // User couldn't sign in (bad verification code?)
        console.error('Error while checking the verification code', error);
        window.alert(
          'Error while checking the verification code:\n\n' +
            error.code +
            '\n\n' +
            error.message,
        );
        window.verifyingCode = false;
        updateSignInButtonUI();
        updateVerifyCodeButtonUI();
      });
  }
}

/**
 * Cancels the verification code input.
 */
function cancelVerification(e: Event) {
  e.preventDefault();
  window.confirmationResult = null;
  updateVerificationCodeFormUI();
  updateSignInFormUI();
}

/**
 * Signs out the user when the sign-out button is clicked.
 */
function onSignOutClick() {
  signOut(auth);
}

/**
 * Reads the verification code from the user input.
 */
function getCodeFromUserInput() {
  return verificationCodeInput.value;
}

/**
 * Reads the phone number from the user input.
 */
function getPhoneNumberFromUserInput() {
  return phoneNumberInput.value;
}

/**
 * Returns true if the phone number is valid.
 */
function isPhoneNumberValid() {
  const pattern = /^\+[0-9\s\-\(\)]+$/;
  const phoneNumber = getPhoneNumberFromUserInput();
  return phoneNumber.search(pattern) !== -1;
}

/**
 * Re-initializes the ReCaptacha widget.
 */
function resetReCaptcha() {
  if (
    typeof grecaptcha !== 'undefined' &&
    typeof window.recaptchaWidgetId !== 'undefined'
  ) {
    grecaptcha.reset(window.recaptchaWidgetId);
  }
}

/**
 * Updates the Sign-in button state depending on ReCAptcha and form values state.
 */
function updateSignInButtonUI() {
  signInButton.disabled = !isPhoneNumberValid() || !!window.signingIn;
}

/**
 * Updates the Verify-code button state depending on form values state.
 */
function updateVerifyCodeButtonUI() {
  verifyCodeButton.disabled = !!window.verifyingCode || !getCodeFromUserInput();
}

/**
 * Updates the state of the Sign-in form.
 */
function updateSignInFormUI() {
  if (auth.currentUser || window.confirmationResult) {
    signInForm.style.display = 'none';
  } else {
    resetReCaptcha();
    signInForm.style.display = 'block';
  }
}

/**
 * Updates the state of the Verify code form.
 */
function updateVerificationCodeFormUI() {
  if (!auth.currentUser && window.confirmationResult) {
    verificationCodeForm.style.display = 'block';
  } else {
    verificationCodeForm.style.display = 'none';
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
  updateSignInFormUI();
  updateSignOutButtonUI();
  updateSignedInUserStatusUI();
  updateVerificationCodeFormUI();
});

// Event bindings.
signOutButton.addEventListener('click', onSignOutClick);
phoneNumberInput.addEventListener('keyup', updateSignInButtonUI);
phoneNumberInput.addEventListener('change', updateSignInButtonUI);
verificationCodeInput.addEventListener('keyup', updateVerifyCodeButtonUI);
verificationCodeInput.addEventListener('change', updateVerifyCodeButtonUI);
verificationCodeForm.addEventListener('submit', onVerifyCodeSubmit);
cancelVerifyCodeButton.addEventListener('click', cancelVerification);

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
  size: 'invisible',
  callback: function (_response: any) {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  },
});

window.recaptchaVerifier!.render().then(function (widgetId) {
  window.recaptchaWidgetId = widgetId;
  updateSignInButtonUI();
});
