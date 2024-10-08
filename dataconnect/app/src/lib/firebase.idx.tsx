import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  connectDataConnectEmulator,
  getDataConnect,
} from "firebase/data-connect";
import { connectorConfig } from '@movie/dataconnect';
import { createContext } from "react";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(firebaseApp);
const dataconnect = getDataConnect(firebaseApp, connectorConfig);

if (process.env.NODE_ENV === "development") {
  connectDataConnectEmulator(
    dataconnect, 
    window.location.hostname,
    undefined,
    true
  );
}

const AuthContext = createContext(auth);

function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
