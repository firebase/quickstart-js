import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Make sure your HTML file has an element with id='root'.",
  );
}

const root = createRoot(rootElement);

root.render(<App />);
