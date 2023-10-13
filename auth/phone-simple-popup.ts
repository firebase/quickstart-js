import { initializeApp } from 'firebase/app';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

const auth = getAuth();

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

// reCAPTCHA verification does not work with the Firebase emulator.
// Hence, we do not connect to the emulator in this example.

const phoneNumberInput = document.getElementById(
  'phone-number',
) as HTMLInputElement;
const signInButton = document.getElementById(
  'sign-in-button',
) as HTMLButtonElement;
const signInForm = document.getElementById('sign-in-form') as HTMLFormElement;

/**
 * Function called when clicking the Login/Logout button.
 */
function onSignInSubmit(e: Event) {
  e.preventDefault();
  if (isPhoneNumberValid()) {
    window.signingIn = true;
    updateSignInButtonUI();
    const phoneNumber = getPhoneNumberFromUserInput();
    const appVerifier = window.recaptchaVerifier!;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        window.signingIn = false;
        updateSignInButtonUI();
        resetRecaptcha();
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        const code = window.prompt(
          'Enter the verification code you received by SMS',
        );
        if (code) {
          confirmationResult
            .confirm(code)
            .then(function () {
              window.close();
            })
            .catch(function (error) {
              // User couldn't sign in (bad verification code?)
              console.error(
                'Error while checking the verification code',
                error,
              );
              window.alert(
                'Error while checking the verification code:\n\n' +
                  error.code +
                  '\n\n' +
                  error.message,
              );
            });
        }
      })
      .catch(function (error) {
        // Error; SMS not sent
        window.signingIn = false;
        console.error('Error during signInWithPhoneNumber', error);
        window.alert(
          'Error during signInWithPhoneNumber:\n\n' +
            error.code +
            '\n\n' +
            error.message,
        );
        updateSignInButtonUI();
        resetRecaptcha();
      });
  }
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
 * This resets the recaptcha widget.
 */
async function resetRecaptcha() {
  const widgetId = await window.recaptchaVerifier!.render();
  grecaptcha.reset(widgetId);
}

/**
 * Updates the Sign-in button state depending on ReCaptcha and form values state.
 */
function updateSignInButtonUI() {
  signInButton.disabled = !isPhoneNumberValid() || !!window.signingIn;
}

signInForm.addEventListener('submit', onSignInSubmit);
phoneNumberInput.addEventListener('keyup', updateSignInButtonUI);
phoneNumberInput.addEventListener('change', updateSignInButtonUI);

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
