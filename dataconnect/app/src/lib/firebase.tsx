import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { createContext } from 'react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(firebaseApp);

if (process.env.NODE_ENV === 'development') {
  // connectDataConnectEmulator(
  //   dataconnect, 
  //   'localhost', 
  //   9399, 
  //   false
  // );
  // connectAuthEmulator(auth, "http://localhost:9099");
}

const AuthContext = createContext(auth);

function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
