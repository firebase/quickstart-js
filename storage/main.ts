import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth';
import {
  connectStorageEmulator,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { firebaseConfig } from './config';

const fileInput = document.getElementById('file') as HTMLInputElement;
const linkBox = document.getElementById('linkbox') as HTMLDivElement;

initializeApp(firebaseConfig);

const auth = getAuth();
const storage = getStorage();

// Locally, we use the firebase emulators.
if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

const storageRef = ref(storage);

function handleFileSelect(e: Event) {
  e.stopPropagation();
  e.preventDefault();

  const target = e.target as HTMLInputElement | null;
  const files = target?.files;
  if (!target || !files) {
    return;
  }

  const file = files[0];

  // Push to child path.
  uploadBytes(ref(storageRef, 'images/' + file.name), file)
    .then(function (snapshot) {
      console.log('Uploaded', snapshot.metadata.size, 'bytes.');
      console.log('File metadata:', snapshot.metadata);
      // Let's get a download URL for the file.
      getDownloadURL(snapshot.ref).then(function (url) {
        console.log('File available at', url);
        linkBox.innerHTML = '<a href="' + url + '">Click For File</a>';
      });
    })
    .catch(function (error) {
      console.error('Upload failed:', error);
    });
}

fileInput.addEventListener('change', handleFileSelect, false);
fileInput.disabled = true;

auth.onAuthStateChanged(function (user) {
  if (user) {
    console.log('Anonymous user signed-in.', user);
    fileInput.disabled = false;
  } else {
    console.log(
      'There was no anonymous session. Creating a new anonymous user.',
    );
    // Sign the user in anonymously since accessing Storage requires the user to be authorized.
    signInAnonymously(auth).catch(function (error) {
      if (error.code === 'auth/operation-not-allowed') {
        window.alert(
          'Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
            'sign-in on your Firebase project.',
        );
      }
    });
  }
});
