import { createContext, useState } from "react";
import { appStatuses } from "src/models/app/appModels";

export const AppStatusContext = createContext(null);
export const SetAppStatusContext = createContext(null);

export const AppStatusProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState(appStatuses.pending);

  return (
    <AppStatusContext.Provider value={appStatus}>
      <SetAppStatusContext.Provider value={setAppStatus}>
        {children}
      </SetAppStatusContext.Provider>
    </AppStatusContext.Provider>
  );
};
