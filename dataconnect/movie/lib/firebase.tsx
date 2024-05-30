import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseapp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseapp);
// const dataconnect = getDataConnect(firebaseapp, {
//   connector: 'movie-connector',
//   service: 'local',
//   location: 'us-central1'
// });
const provider = new GoogleAuthProvider();

if (process.env.NODE_ENV === 'development') {
  // connectDataConnectEmulator(
  //   dataconnect, 
  //   'localhost', 
  //   9399, 
  //   false
  // );
  // connectAuthEmulator(auth, "http://localhost:9099");
}

export { firebaseapp, auth, onAuthStateChanged };
