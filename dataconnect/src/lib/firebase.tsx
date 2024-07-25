import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { createContext } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseapp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(firebaseapp);

if (process.env.NODE_ENV === 'development') {
//   connectDataConnectEmulator(
//     dataconnect, 
//     '127.0.0.1', 
//     9399, 
//     false
//   );
//   // connectAuthEmulator(auth, "http://127.0.0.1:9099");
}
const AuthContext = createContext(auth);
function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = getAuth(firebaseapp);

  return (
    <AuthContext.Provider value={ auth }>
      {children}
    </AuthContext.Provider>
  );
}

export { firebaseapp, AuthContext, AuthProvider };
