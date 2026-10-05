import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../css/global-styles.css";
import "../css/list-styles.css";
import "../css/favourite-styles.css";
import "../css/game-styles.css";
import "../css/detail-styles.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);