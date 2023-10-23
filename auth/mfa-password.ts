/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview The quickstart app for using phone number as second factor.
 */

// reCAPTCHA verification does not work with the Firebase emulator.
// Hence, we do not connect to the emulator in this example.

import { initializeApp } from 'firebase/app';
import {
  MultiFactorInfo,
  MultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  User,
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

initializeApp(firebaseConfig);

const auth = getAuth();

let mfaResolver: MultiFactorResolver | null = null;
let phoneVerificationId: string | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaWidgetId: number | null = null;

declare const grecaptcha: any; // from Google reCAPTCHA V3

const emailInput = document.getElementById('email')! as HTMLInputElement;
const passwordInput = document.getElementById('password')! as HTMLInputElement;
const mfaModal = document.getElementById('mfa-modal')! as HTMLDialogElement;
const phoneNumberInput = document.getElementById(
  'phone-number',
)! as HTMLInputElement;
const signOutButton = document.getElementById(
  'quickstart-sign-out',
)! as HTMLButtonElement;
const enrollButton = document.getElementById(
  'quickstart-enroll',
)! as HTMLButtonElement;
const verifyEmailButton = document.getElementById(
  'quickstart-verify-email',
)! as HTMLButtonElement;
const signInStatus = document.getElementById(
  'quickstart-sign-in-status',
)! as HTMLSpanElement;
const signInButton = document.getElementById(
  'quickstart-sign-in',
)! as HTMLButtonElement;
const signUpButton = document.getElementById(
  'quickstart-sign-up',
)! as HTMLButtonElement;
const passwordResetButton = document.getElementById(
  'quickstart-password-reset',
)! as HTMLButtonElement;
const enrolSendCodeForm = document.getElementById(
  'enroll-send-code-form',
)! as HTMLFormElement;
const enrollCancelSendCodeButton = document.getElementById(
  'enroll-cancel-send-code-button',
)! as HTMLButtonElement;
const enrollVerificationCodeForm = document.getElementById(
  'enroll-verification-code-form',
)! as HTMLFormElement;
const enrollCancelVerifyCodeButton = document.getElementById(
  'enroll-cancel-verify-code-button',
)! as HTMLButtonElement;
const signInSendCodeForm = document.getElementById(
  'sign-in-send-code-form',
)! as HTMLFormElement;
const signInCancelSendCodeButton = document.getElementById(
  'sign-in-cancel-send-code-button',
)! as HTMLButtonElement;
const mfaHints = document.getElementById('mfa-hints')! as HTMLSelectElement;
const signInVerificationCodeForm = document.getElementById(
  'sign-in-verification-code-form',
)! as HTMLFormElement;
const signInCancelVerifyCodeButton = document.getElementById(
  'sign-in-cancel-verify-code-button',
)! as HTMLButtonElement;

/**
 * Signs in the user with email and password.
 */
function passwordSignIn() {
  const email = emailInput.value;
  const password = passwordInput.value;
  // Sign in with email and password.
  signInWithEmailAndPassword(auth, email, password)
    .then(function () {
      alertMessage('User signed in!');
    })
    .catch(function (error: any) {
      // Handle second factor sign-in.
      if (error.code === 'auth/multi-factor-auth-required') {
        mfaResolver = getMultiFactorResolver(auth, error);
        showMfaDialog();
        return;
      }
      displayError(error);
    });
}

/**
 * Creates a user with email and password.
 */
function passwordSignUp() {
  const email = emailInput.value;
  const password = passwordInput.value;
  // Sign up with email and password.
  createUserWithEmailAndPassword(auth, email, password)
    .then(function () {
      alertMessage('New user created!');
    })
    .catch(displayError);
}

/**
 * Signs out the current user.
 */
function signOutCurrentUser() {
  signOut(auth)
    .then(function () {
      alertMessage('User signed out!');
    })
    .catch(displayError);
}

/**
 * Sends an email verification to the current user.
 */
function sendEmailVerificationToUser() {
  if (auth.currentUser) {
    sendEmailVerification(auth.currentUser)
      .then(function () {
        alertMessage('Email Verification Sent!');
      })
      .catch(displayError);
  }
}

/**
 * Sends a password reset email to the user.
 */
function sendPasswordReset() {
  const email = emailInput.value;
  sendPasswordResetEmail(auth, email)
    .then(function () {
      alertMessage('Password Reset Email Sent!');
    })
    .catch(displayError);
}

/**
 * Updates the multi-factor dialog UI for enrollment/sign-in flows.
 */
function updateMfaDialog() {
  hideElement('mfa-error-message');
  // For multi-factor sign-in.
  if (mfaResolver) {
    showElement('mfa-sign-in-modal');
    hideElement('mfa-enroll-modal');
    if (phoneVerificationId) {
      // Display verify code form.
      clearAppVerifier();
      hideElement('sign-in-send-code-form');
      showElement('sign-in-verification-code-form');
    } else {
      // Display send code form.
      updateMfaSignInHints(mfaResolver.hints);
      showElement('sign-in-send-code-form');
      hideElement('sign-in-verification-code-form');
      renderRecaptcha('sign-in-recaptcha-container');
      updateSignInSendCodeButtonUI();
    }
    // For multi-factor enrollment.
  } else {
    hideElement('mfa-sign-in-modal');
    showElement('mfa-enroll-modal');
    if (phoneVerificationId) {
      // Display verify code form.
      clearAppVerifier();
      hideElement('enroll-send-code-form');
      showElement('enroll-verification-code-form');
    } else {
      // Display send code form.
      showElement('enroll-send-code-form');
      hideElement('enroll-verification-code-form');
      renderRecaptcha('enroll-recaptcha-container');
      updateEnrollSendCodeButtonUI();
    }
  }
}

/**
 * Handles the enroll button click.
 */
function onEnrollClick() {
  if (auth.currentUser) {
    auth.currentUser
      .reload()
      .then(function () {
        showMfaDialog();
      })
      .catch(displayError);
  }
}

/**
 * Displays the multi-factor dialog.
 */
function showMfaDialog() {
  updateMfaDialog();
  mfaModal.show();
}

/**
 * Displays Recaptcha verifier in the provided container.
 * @param {!HTMLElement|string} container The reCAPTCHA container.
 */
function renderRecaptcha(container: HTMLElement | string) {
  recaptchaVerifier = new RecaptchaVerifier(auth, container, {
    size: 'normal',
    callback: function (_response: any) {
      // reCAPTCHA solved, allow send code for enrollment/sign-in.
      updateEnrollSendCodeButtonUI();
      updateSignInSendCodeButtonUI();
    },
    'expired-callback': function () {
      // Response expired. Ask user to solve reCAPTCHA again.
      updateEnrollSendCodeButtonUI();
      updateSignInSendCodeButtonUI();
    },
  });
  recaptchaVerifier.render().then(function (widgetId) {
    console.log({ widgetId });
    recaptchaWidgetId = widgetId;
  });
}

/**
 * Displays the account details of the current user.
 * @param {?User} user The current signed in user.
 */
function showAccountDetails(user: User | null) {
  const accountDetails = user ? JSON.stringify(user, null, '  ') : null;
  document.getElementById('quickstart-account-details')!.textContent =
    accountDetails;
}

/**
 * Displays the enrolled second factors of the current user.
 * @param {!Array<!MultiFactorInfo>} enrolledFactors The
 *     enrolled second factors of the current user.
 */
function showEnrolledFactors(enrolledFactors: MultiFactorInfo[]) {
  const listGroup = document.getElementById('mfa-enrolled-factors')!;
  // Clear the list.
  listGroup.innerHTML = '';
  if (enrolledFactors.length == 0) {
    listGroup.innerHTML = 'N/A';
  }
  enrolledFactors.forEach(function (value, i) {
    // Append entry to list.
    const displayName = value.displayName || 'N/A';
    // phoneNumber exsits on MultiFactorInfo, but is not typed
    // @ts-ignore
    const phoneNumber: string = value.phoneNumber ?? 'NO_PHONE_NUMBER';
    const node = document.createElement('li');
    node.classList.add('mdl-list__item');
    node.setAttribute('data-val', i.toString());
    node.textContent = phoneNumber + '  ' + displayName;
    // Append delete icon.
    const icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.classList.add('mdl-list__item-icon');
    icon.textContent = 'delete';
    icon.addEventListener('click', onUnenroll);
    node.appendChild(icon);
    listGroup.appendChild(node);
  });
}

/**
 * Updates the second factor dropdown options for sign-in.
 * @param {!Array<!MultiFactorInfo>} hints The sign-in
 *     second factor hints.
 */
function updateMfaSignInHints(hints: MultiFactorInfo[]) {
  // Clear the list.
  mfaHints.innerHTML = '';
  mfaHints.appendChild(document.createElement('option'));
  hints.forEach(function (value, i) {
    // Append entry to list.
    const node = document.createElement('option');
    node.setAttribute('data-val', i.toString());
    // phoneNumber exsits on MultiFactorInfo, but is not typed
    // @ts-ignore
    node.textContent = value.phoneNumber ?? 'NO_PHONE_NUMBER';
    mfaHints.appendChild(node);
  });
}

/**
 * Handles the multi-factor hints selection for sign-in.
 * @param {!Event} e The phone number dropdown on change event.
 */
function onSelect(e: Event) {
  const label = document.getElementById('mfa-hint-label')!;
  label.className = label.className.replace(' is-active', '');
  const target = e.target as HTMLSelectElement;
  if (target.value) {
    label.className += ' is-active';
  }
}

/**
 * Handles send code button click for second factor enrollment.
 * @param {!Event} e The send code for enrollment on click event.
 */
async function onEnrollSendCode(e: Event) {
  e.preventDefault();
  if (isCaptchaOK() && isPhoneNumberValid() && auth.currentUser) {
    const phoneNumber = phoneNumberInput.value;

    const provider = new PhoneAuthProvider(auth);
    multiFactor(auth.currentUser)
      .getSession()
      .then(function (multiFactorSession) {
        const phoneInfoOptions = {
          phoneNumber: phoneNumber,
          session: multiFactorSession,
        };
        // Send code for enrollment.
        return provider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier!);
      })
      .then(
        function (verificationId) {
          phoneVerificationId = verificationId;
          // Update the multi-factor dialog to verify the sent code.
          updateMfaDialog();
        },
        function (error) {
          updateEnrollSendCodeButtonUI();
          displayMfaError(error);
        },
      );
  }
}

/**
 * Handles verify code button click for second factor enrollment.
 * @param {!Event} e The verify code for enrollment on click event.
 */
function onEnrollVerifyCode(e: Event) {
  e.preventDefault();
  if (auth.currentUser && phoneVerificationId) {
    const enrolVerificationCodeInput = document.getElementById(
      'enroll-verification-code',
    )! as HTMLInputElement;
    const code = enrolVerificationCodeInput.value;
    const credential = PhoneAuthProvider.credential(phoneVerificationId, code);
    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(credential);
    const enrollDisplayNameInput = document.getElementById(
      'enroll-display-name',
    )! as HTMLInputElement;
    const displayName = enrollDisplayNameInput.value || undefined;
    // Enroll the phone second factor.
    multiFactor(auth.currentUser)
      .enroll(multiFactorAssertion, displayName)
      .then(function () {
        showAccountDetails(auth.currentUser!);
        const enrolledFactors = multiFactor(auth.currentUser!).enrolledFactors;
        showEnrolledFactors(enrolledFactors);
        clearMfaDialog();
        alertMessage('Second factor enrolled!');
      })
      .catch(displayMfaError);
  }
}

/**
 * Handles send code button click for second factor sign-in.
 * @param {!Event} e The send code for sign-in on click event.
 */
function onSignInSendCode(e: Event) {
  e.preventDefault();
  if (isCaptchaOK() && mfaResolver) {
    const index = parseInt(
      mfaHints.options[mfaHints.selectedIndex].getAttribute('data-val')!,
      10,
    );
    const info = mfaResolver.hints[index];
    const provider = new PhoneAuthProvider(auth);
    const signInRequest = {
      multiFactorHint: info,
      session: mfaResolver.session,
    };
    provider.verifyPhoneNumber(signInRequest, recaptchaVerifier!).then(
      function (verificationId) {
        phoneVerificationId = verificationId;
        updateMfaDialog();
      },
      function (error) {
        updateSignInSendCodeButtonUI();
        displayMfaError(error);
      },
    );
  }
}

/**
 * Handles verify code button click for second factor sign-in.
 * @param {!Event} e The verify code for sign-in on click event.
 */
function onSignInVerifyCode(e: Event) {
  e.preventDefault();
  if (mfaResolver && phoneVerificationId) {
    const signInVerificationCodeInput = document.getElementById(
      'sign-in-verification-code',
    )! as HTMLInputElement;
    const code = signInVerificationCodeInput.value;
    const credential = PhoneAuthProvider.credential(phoneVerificationId, code);
    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(credential);
    mfaResolver
      .resolveSignIn(multiFactorAssertion)
      .then(function () {
        alertMessage('Signed in with second factor!');
        clearMfaDialog();
        const enrolledFactors = multiFactor(auth.currentUser!).enrolledFactors;
        showEnrolledFactors(enrolledFactors);
      })
      .catch(displayMfaError);
  }
}

/**
 * Handles unenroll icon click for enrolled second factors.
 * @param {!Event} e The unenroll on click event.
 */
function onUnenroll(e: Event) {
  const target = e.target as HTMLElement;
  const parent = target.parentNode as HTMLElement;
  const index = parseInt(parent.getAttribute('data-val')!, 10);
  if (auth.currentUser) {
    const info = multiFactor(auth.currentUser).enrolledFactors[index];
    if (info) {
      multiFactor(auth.currentUser)
        .unenroll(info)
        .then(function () {
          alertMessage(
            // phoneNumber exsits on MultiFactorInfo, but is not typed
            // @ts-ignore
            info.phoneNumber ?? 'NO_PHONE_NUMBER' + ' has been unenrolled!',
          );
          showAccountDetails(auth.currentUser!);
          const enrolledFactors =
            (auth.currentUser &&
              multiFactor(auth.currentUser).enrolledFactors) ||
            [];
          showEnrolledFactors(enrolledFactors);
        })
        .catch(displayError);
    }
  }
}

/**
 * Handles cancel button click.
 * @param {!Event} e The cancel on click event.
 */
function onCancel(e: Event) {
  e.preventDefault();
  clearMfaDialog();
}

/**
 * Returns true if the input of phone number entry is valid.
 * @return {boolean} Whether the phone number is valid.
 */
function isPhoneNumberValid() {
  const pattern = /^\+[0-9\s\-()]+$/;
  const phoneNumber = phoneNumberInput.value;
  return phoneNumber.search(pattern) !== -1;
}

/**
 * Returns true if the ReCaptcha is in an OK state.
 * @return {boolean} Whether the ReCaptcha is in OK state.
 */
function isCaptchaOK() {
  if (typeof grecaptcha !== 'undefined' && recaptchaWidgetId !== null) {
    const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);
    return !!recaptchaResponse;
  }
  return false;
}

/**
 * Updates the enroll send code button state depending on form values state.
 */
function updateEnrollSendCodeButtonUI() {
  const sendCode = document.getElementById(
    'enroll-send-code-button',
  )! as HTMLButtonElement;
  sendCode.disabled = !isCaptchaOK() || !isPhoneNumberValid();
}

/**
 * Updates the sign in send code button state depending on form values state.
 */
function updateSignInSendCodeButtonUI() {
  const signInSendCode = document.getElementById(
    'sign-in-send-code-button',
  )! as HTMLButtonElement;
  signInSendCode.disabled = !isCaptchaOK();
}

/**
 * Clears the application verifier.
 */
function clearAppVerifier() {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  recaptchaWidgetId = null;
}

/**
 * Clears the multi-factor dialog.
 */
function clearMfaDialog() {
  mfaResolver = null;
  phoneVerificationId = null;
  mfaModal.close();
  clearAppVerifier();
}

/**
 * Shows the element by ID.
 * @param {string} elementId The ID of the element.
 */
function showElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
  }
}

/**
 * Hides the element by ID.
 * @param {string} elementId The ID of the element.
 */
function hideElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Alerts the error message in the toast and logs the error in the console.
 * @param {!Error} error The error to display.
 */
function displayError(error: Error) {
  alertMessage(error.message);
  console.error(error);
}

/**
 * Displays the error message in the mfa dialog and logs the error in the console.
 * @param {!Error} error The mfa error.
 */
function displayMfaError(error: Error) {
  console.error(error);
  document.getElementById('mfa-error-message')!.textContent = error.message;
  showElement('mfa-error-message');
}

/**
 * Displays the alert message in the toast.
 */
function alertMessage(msg: string) {
  const snackbarContainer = document.getElementById(
    'quickstart-snackbar',
  )! as HTMLDivElement;
  const data = {
    message: msg,
  };
  // MaterialSnackbar comes from the MDL library
  (snackbarContainer as any).MaterialSnackbar.showSnackbar(data);
}

// Listening for Auth state changes.
onAuthStateChanged(auth, function (user) {
  signOutButton.disabled = true;
  enrollButton.disabled = true;
  verifyEmailButton.disabled = true;
  if (user) {
    signInStatus.textContent = 'Signed in';
    signOutButton.disabled = false;
    enrollButton.disabled = false;
    if (!user.emailVerified) {
      verifyEmailButton.disabled = false;
    }
    showAccountDetails(user);
    showEnrolledFactors(multiFactor(user).enrolledFactors);
  } else {
    // User is signed out.
    signInStatus.textContent = 'Signed out';
    showAccountDetails(null);
    showEnrolledFactors([]);
  }
});

signInButton.addEventListener('click', passwordSignIn);
signUpButton.addEventListener('click', passwordSignUp);
signOutButton.addEventListener('click', signOutCurrentUser);
verifyEmailButton.addEventListener('click', sendEmailVerificationToUser);
passwordResetButton.addEventListener('click', sendPasswordReset);
enrollButton.addEventListener('click', onEnrollClick);

phoneNumberInput.addEventListener('keyup', updateEnrollSendCodeButtonUI);
phoneNumberInput.addEventListener('change', updateEnrollSendCodeButtonUI);

enrolSendCodeForm.addEventListener('submit', onEnrollSendCode);
enrollCancelSendCodeButton.addEventListener('click', onCancel);

enrollVerificationCodeForm.addEventListener('submit', onEnrollVerifyCode);
enrollCancelVerifyCodeButton.addEventListener('click', onCancel);

signInSendCodeForm.addEventListener('submit', onSignInSendCode);
signInCancelSendCodeButton.addEventListener('click', onCancel);
mfaHints.addEventListener('change', onSelect);

signInVerificationCodeForm.addEventListener('submit', onSignInVerifyCode);
signInCancelVerifyCodeButton.addEventListener('click', onCancel);
