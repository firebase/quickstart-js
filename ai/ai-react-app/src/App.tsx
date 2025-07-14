import { useEffect, useState } from "react";
import MainLayout from "./components/Layout/MainLayout";

// Defines the primary modes or views available in the application.
export type AppMode = "chat" | "imagenGen";

function App() {
  // State to manage which main view ('chat' or 'imagenGen') is currently active.
  const [activeMode, setActiveMode] = useState<AppMode>("chat");

  useEffect(() => {
    const checkConfig = async () => {
      // Dynamically import config to avoid potential early errors if placeholders exist
      const { firebaseConfig } = await import("./config/firebase-config");
      if (
        firebaseConfig.apiKey === "YOUR_API_KEY" ||
        !firebaseConfig.projectId
      ) {
        alert(
          "WARNING: Firebase configuration in src/config/firebase-config.ts contains placeholder values. The app may not function correctly. Please replace them with your actual project configuration.",
        );
      }
    };
    checkConfig();
  }, []);

  return <MainLayout activeMode={activeMode} setActiveMode={setActiveMode} />;
}

export default App;
