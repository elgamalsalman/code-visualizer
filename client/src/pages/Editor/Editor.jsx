import React from "react";
import App from "src/app/App";

import { AppStatusProvider } from "src/contexts/appStatusContext";

function Editor() {
  return (
    <AppStatusProvider>
      <App />
    </AppStatusProvider>
  );
}

export default Editor;
