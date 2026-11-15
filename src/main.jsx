import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "../css/global-styles.css";
import "../css/filter-styles.css";
import "../css/list-styles.css";
import "../css/favourite-styles.css";
import "../css/game-styles.css";
import "../css/detail-styles.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </StrictMode>,
);
