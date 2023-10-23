// NOTE: This is an example token generator to allow you to easily create
// Firebase custom auth tokens with a service account JSON file. You should
// integrate token generation and signing in to your own code using a Google
// client library for the language you work with.

import { KJUR } from 'jsrsasign';

type Payload = {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  user_id: string;
  scope: string;
};

// These values are extracted from the service account JSON.
let sub = '';
let sPKCS8PEM = '';
let kid = '';

// Generate an ID token and sign it with the private key.
function handleGenerateClick() {
  const uidInput = document.getElementById('uid')! as HTMLInputElement;
  const uid = uidInput.value;
  if (uid == '') {
    console.log('Blank uid');
    return;
  }
  // Header
  const oHeader = { alg: 'RS256', kid: kid, typ: 'JWT' };

  const tNow = KJUR.jws.IntDate.get('now');
  const tEnd = KJUR.jws.IntDate.get('now + 1hour');

  // Payload
  const oPayload: Payload = {
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    exp: tEnd,
    iat: tNow,
    iss: sub,
    sub: sub,
    user_id: uid,
    scope: 'https://www.googleapis.com/auth/identitytoolkit',
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);

  const sJWT = KJUR.jws.JWS.sign(
    null,
    sHeader,
    sPayload,
    sPKCS8PEM,
    'notasecret',
  );

  const tokenBox = document.getElementById('tokenbox')! as HTMLParagraphElement;
  tokenBox.textContent = sJWT;
  console.log(sJWT);

  const link =
    '<a href="../customauth.html#token=' +
    sJWT +
    '">Use this token in the web custom auth example</a>';
  const linkToTokenBox = document.getElementById(
    'linktokenbox',
  )! as HTMLParagraphElement;
  linkToTokenBox.innerHTML = link;
}

function handleFileSelect(evt: Event) {
  evt.stopPropagation();
  evt.preventDefault();
  const files = (evt.target as HTMLInputElement).files!;
  for (let i = 0, f; (f = files[i]); i++) {
    if (f.type === 'application/json') {
      loadJson(f);
      return;
    }
  }
  console.log('No JSON file found!');
}

function loadJson(f: File) {
  const reader = new FileReader();
  reader.onload = function () {
    const data = JSON.parse(reader.result?.toString()!);
    console.log(data);
    if (data.type && data.type === 'service_account') {
      kid = data.private_key_id;
      sPKCS8PEM = data.private_key;
      sub = data.client_email;
      const noToken = document.getElementById('notoken')! as HTMLDivElement;
      const getToken = document.getElementById('gettoken')! as HTMLDivElement;
      const subText = document.getElementById('subtext')! as HTMLHeadingElement;
      noToken.style.display = 'none';
      getToken.style.display = 'block';
      subText.textContent = 'Generating Tokens For ' + sub;
    } else {
      console.log('Bad file read.');
    }
  };
  reader.readAsText(f);
}

const fileInput = document.getElementById('file')! as HTMLInputElement;
const goButton = document.getElementById('go')! as HTMLButtonElement;

fileInput.addEventListener('change', handleFileSelect, false);
goButton.addEventListener('click', handleGenerateClick, false);
