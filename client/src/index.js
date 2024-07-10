import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";

import store from "src/redux/store";
import { AppStatusProvider } from "./contexts/appStatusContext";

import App from "src/app/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppStatusProvider>
        <App />
      </AppStatusProvider>
    </Provider>
  </React.StrictMode>,
);
