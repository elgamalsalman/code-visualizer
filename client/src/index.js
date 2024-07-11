import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { AppStatusProvider } from "./contexts/appStatusContext";

import App from "src/app/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppStatusProvider>
      <App />
    </AppStatusProvider>
  </React.StrictMode>,
);
