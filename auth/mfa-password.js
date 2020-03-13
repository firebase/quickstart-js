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


var mfaResolver = null;
var phoneVerificationId = null;
var recaptchaVerifier = null;
var recaptchaWidgetId = null;
var grecaptcha;

/**
 * Signs in the user with email and password.
 */
function passwordSignIn() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  // Sign in with email and password.
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
      alertMessage('User signed in!');
    }) 
    .catch(function(error) {
      // Handle second factor sign-in.
      if (error.code === 'auth/multi-factor-auth-required') {
        mfaResolver = error.resolver;
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
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  // Sign up with email and password.
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
      alertMessage('New user created!');
    }).catch(displayError);
}

/**
 * Signs out the current user.
 */
function signOut() {
  firebase.auth().signOut().then(function() {
    alertMessage('User signed out!');
  }).catch(displayError);
}

/**
 * Sends an email verification to the current user.
 */
function sendEmailVerification() {
  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      alertMessage('Email Verification Sent!');
    }).catch(displayError);
  }
}

/**
 * Sends a password reset email to the user.
 */
function sendPasswordReset() {
  var email = document.getElementById('email').value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alertMessage('Password Reset Email Sent!');
  }).catch(displayError);
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
  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.reload().then(function() {
      showMfaDialog();
    }).catch(displayError);
  }
}

/**
 * Displays the multi-factor dialog.
 */
function showMfaDialog() {
  updateMfaDialog();
  document.getElementById('mfa-modal').show();
}

/**
 * Displays Recaptcha verifier in the provided container.
 * @param {!Element|string} container The reCAPTCHA container.
 */
function renderRecaptcha(container) {
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier(container, {
    'size': 'normal',
    'callback': function(response) {
      // reCAPTCHA solved, allow send code for enrollment/sign-in.
      updateEnrollSendCodeButtonUI();
      updateSignInSendCodeButtonUI();
    },
    'expired-callback': function() {
      // Response expired. Ask user to solve reCAPTCHA again.
      updateEnrollSendCodeButtonUI();
      updateSignInSendCodeButtonUI();
    }
  });
  recaptchaVerifier.render().then(function(widgetId) {
    recaptchaWidgetId = widgetId;
  });
}


/**
 * Displays the account details of the current user.
 * @param {?firebase.User} user The current signed in user.
 */
function showAccountDetails(user) {
  var accountDetails = user ? JSON.stringify(user, null, '  ') : null;
  document.getElementById('quickstart-account-details').textContent = accountDetails;
}

/**
 * Displays the enrolled second factors of the current user.
 * @param {!Array<!firebase.auth.MultiFactorInfo>} enrolledFactors The
 *     enrolled second factors of the current user.
 */
function showEnrolledFactors(enrolledFactors) {
  var listGroup = document.getElementById('mfa-enrolled-factors');
  // Clear the list.
  listGroup.innerHTML = '';
  if (enrolledFactors.length == 0) {
    listGroup.innerHTML = 'N/A';
  }
  enrolledFactors.forEach(function(value, i) {
    // Append entry to list.
    var displayName = value.displayName || 'N/A';
    var phoneNumber = value.phoneNumber;
    var node = document.createElement('li');  
    node.classList.add('mdl-list__item');
    node.setAttribute('data-val', i);
    node.textContent = phoneNumber + '  ' + displayName;
    // Append delete icon.
    var icon = document.createElement('i');
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
 * @param {!Array<!firebase.auth.MultiFactorInfo>} hints The sign-in
 *     second factor hints.
 */
function updateMfaSignInHints(hints) {
  var listGroup = document.getElementById('mfa-hints');
  // Clear the list.
  listGroup.innerHTML = '';
  listGroup.appendChild(document.createElement('option'));
  hints.forEach(function(value, i) {
    // Append entry to list.
    var node = document.createElement('option');  
    node.setAttribute('data-val', i);
    node.textContent = value.phoneNumber;
    listGroup.appendChild(node);   
  });
}

/**
 * Handles the multi-factor hints selection for sign-in.
 * @param {!Event} e The phone number dropdown on change event.
 */
function onSelect(e) {
  var label = document.getElementById('mfa-hint-label');
  label.className = label.className.replace(' is-active', '');
  if (e.target.value) {
    label.className += ' is-active';
  }
}

/**
 * Handles send code button click for second factor enrollment.
 * @param {!Event} e The send code for enrollment on click event.
 */
function onEnrollSendCode(e) {
  e.preventDefault();
  if (isCaptchaOK() && isPhoneNumberValid() && firebase.auth().currentUser) {
    var phoneNumber = document.getElementById('phone-number').value;

    var provider = new firebase.auth.PhoneAuthProvider(firebase.auth());
    firebase.auth().currentUser.multiFactor.getSession()
      .then(function(multiFactorSession) {
        var phoneInfoOptions = {
          'phoneNumber': phoneNumber,
          'session': multiFactorSession
        };
        // Send code for enrollment.
        return provider.verifyPhoneNumber(
          phoneInfoOptions, recaptchaVerifier);
      }).then(function(verificationId) {
        phoneVerificationId = verificationId;
        // Update the multi-factor dialog to verify the sent code.
        updateMfaDialog();
      }, function(error) {
        updateEnrollSendCodeButtonUI();
        displayMfaError(error);
      });
  }
}

/**
 * Handles verify code button click for second factor enrollment.
 * @param {!Event} e The verify code for enrollment on click event.
 */
function onEnrollVerifyCode(e) {
  e.preventDefault();
  if (firebase.auth().currentUser && phoneVerificationId) {
    var code = document.getElementById('enroll-verification-code').value;
    var credential = firebase.auth.PhoneAuthProvider.credential(
      phoneVerificationId, code);
    var multiFactorAssertion =
        firebase.auth.PhoneMultiFactorGenerator.assertion(credential);
    var displayName = document.getElementById('enroll-display-name').value || undefined;
    // Enroll the phone second factor.
    firebase.auth().currentUser.multiFactor.enroll(multiFactorAssertion, displayName)
      .then(function () {
        showAccountDetails(firebase.auth().currentUser);
        var enrolledFactors = firebase.auth().currentUser.multiFactor.enrolledFactors;
        showEnrolledFactors(enrolledFactors);
        clearMfaDialog();
        alertMessage('Second factor enrolled!');
      }).catch(displayMfaError);
  }
}

/**
 * Handles send code button click for second factor sign-in.
 * @param {!Event} e The send code for sign-in on click event.
 */
function onSignInSendCode(e) {
  e.preventDefault();
  if (isCaptchaOK() && mfaResolver) {
    var node = document.getElementById('mfa-hints');
    var index = parseInt(node.options[node.selectedIndex].getAttribute('data-val'), 10);
    var info = mfaResolver.hints[index];
    var provider = new firebase.auth.PhoneAuthProvider(firebase.auth());
    var signInRequest = {
      multiFactorHint: info,
      session: mfaResolver.session
    };
    provider.verifyPhoneNumber(signInRequest, recaptchaVerifier)
      .then(function(verificationId) {
        phoneVerificationId = verificationId;
        updateMfaDialog();
      }, function(error) {
        updateSignInSendCodeButtonUI();
        displayMfaError(error);
      });
  }
}

/**
 * Handles verify code button click for second factor sign-in.
 * @param {!Event} e The verify code for sign-in on click event.
 */
function onSignInVerifyCode(e) {
  e.preventDefault();
  if (mfaResolver && phoneVerificationId) {
    var code = document.getElementById('sign-in-verification-code').value;
    var credential = firebase.auth.PhoneAuthProvider.credential(
      phoneVerificationId, code);
    var multiFactorAssertion =
        firebase.auth.PhoneMultiFactorGenerator.assertion(credential);
    mfaResolver.resolveSignIn(multiFactorAssertion).then(function () {
      alertMessage('Signed in with second factor!');
      clearMfaDialog();
      var enrolledFactors = firebase.auth().currentUser.multiFactor.enrolledFactors;
      showEnrolledFactors(enrolledFactors);
    }).catch(displayMfaError);
  }
}

/**
 * Handles unenroll icon click for enrolled second factors.
 * @param {!Event} e The unenroll on click event.
 */
function onUnenroll(e) {
  var index = parseInt(e.target.parentNode.getAttribute('data-val'), 10);
  if (firebase.auth().currentUser) {
    var info = firebase.auth().currentUser.multiFactor.enrolledFactors[index];
    if (info) {
      firebase.auth().currentUser.multiFactor.unenroll(info).then(function() {
        alertMessage(info.phoneNumber + ' has been unenrolled!');
        showAccountDetails(firebase.auth().currentUser);
        var enrolledFactors = (firebase.auth().currentUser &&
                               firebase.auth().currentUser.multiFactor.enrolledFactors) || [];
        showEnrolledFactors(enrolledFactors);
      }).catch(displayError);
    }
  }
}

/**
 * Handles cancel button click.
 * @param {!Event} e The cancel on click event.
 */
function onCancel(e) {
  e.preventDefault();
  clearMfaDialog();
}

/**
 * Returns true if the input of phone number entry is valid.
 * @return {boolean} Whether the phone number is valid.
 */
function isPhoneNumberValid() {
  var pattern = /^\+[0-9\s\-()]+$/;
  var phoneNumber = document.getElementById('phone-number').value;
  return phoneNumber.search(pattern) !== -1;
}

/**
 * Returns true if the ReCaptcha is in an OK state.
 * @return {boolean} Whether the ReCaptcha is in OK state.
 */
function isCaptchaOK() {
  if (typeof grecaptcha !== 'undefined' &&
      recaptchaWidgetId !== null) {
    var recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);
    return !!recaptchaResponse;
  }
  return false;
}

/** 
 * Updates the enroll send code button state depending on form values state.
 */
function updateEnrollSendCodeButtonUI() {
  document.getElementById('enroll-send-code-button').disabled =
    !isCaptchaOK() || !isPhoneNumberValid();
}

/** 
 * Updates the sign in send code button state depending on form values state.
 */
function updateSignInSendCodeButtonUI() {
  document.getElementById('sign-in-send-code-button').disabled = !isCaptchaOK();
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
  document.getElementById('mfa-modal').close();
  clearAppVerifier();
}

/**
 * Shows the element by ID.
 * @param {string} elementId The ID of the element.
 */
function showElement(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
  }
}

/**
 * Hides the element by ID.
 * @param {string} elementId The ID of the element.
 */
function hideElement(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Alerts the error message in the toast and logs the error in the console.
 * @param {!Error} error The error to display.
 */
function displayError(error) {
  alertMessage(error.message);
  console.error(error);
}

/**
 * Displays the error message in the mfa dialog and logs the error in the console.
 * @param {!Error} error The mfa error.
 */
function displayMfaError(error) {
  console.error(error);
  document.getElementById('mfa-error-message').textContent = error.message;
  showElement('mfa-error-message');
}

/**
 * Displays the alert message in the toast.
 */
function alertMessage(msg) {
  var snackbarContainer = document.getElementById('quickstart-snackbar');
  var data = {
    message: msg
  };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for Auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('quickstart-sign-out').disabled = true;
    document.getElementById('quickstart-enroll').disabled = true;
    document.getElementById('quickstart-verify-email').disabled = true;
    if (user) {
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-sign-out').disabled = false;
      document.getElementById('quickstart-enroll').disabled = false;
      if (!user.emailVerified) {
        document.getElementById('quickstart-verify-email').disabled = false;
      }
      showAccountDetails(user);
      showEnrolledFactors(user.multiFactor.enrolledFactors);
    } else {
      // User is signed out.
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      showAccountDetails(null);
      showEnrolledFactors([]);       
    }
  });
  document.getElementById('quickstart-sign-in').addEventListener('click', passwordSignIn);
  document.getElementById('quickstart-sign-up').addEventListener('click', passwordSignUp);
  document.getElementById('quickstart-sign-out').addEventListener('click', signOut);
  document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification);
  document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset);
  document.getElementById('quickstart-enroll').addEventListener('click', onEnrollClick);

  document.getElementById('phone-number').addEventListener('keyup', updateEnrollSendCodeButtonUI);
  document.getElementById('phone-number').addEventListener('change', updateEnrollSendCodeButtonUI);
  
  document.getElementById('enroll-send-code-form').addEventListener('submit', onEnrollSendCode);
  document.getElementById('enroll-cancel-send-code-button').addEventListener('click', onCancel);

  document.getElementById('enroll-verification-code-form').addEventListener('submit', onEnrollVerifyCode);
  document.getElementById('enroll-cancel-verify-code-button').addEventListener('click', onCancel);

  document.getElementById('sign-in-send-code-form').addEventListener('submit', onSignInSendCode);
  document.getElementById('sign-in-cancel-send-code-button').addEventListener('click', onCancel);
  document.getElementById('mfa-hints').addEventListener('change', onSelect);

  document.getElementById('sign-in-verification-code-form').addEventListener('submit', onSignInVerifyCode);
  document.getElementById('sign-in-cancel-verify-code-button').addEventListener('click', onCancel);
}

window.onload = function() {
  initApp();
};
