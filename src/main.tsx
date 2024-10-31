import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./providers/app-providers";
import { StrictMode } from "react";
import { App } from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
