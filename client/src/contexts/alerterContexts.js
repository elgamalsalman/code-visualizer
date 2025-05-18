import { useImmer } from "use-immer";
import { createContext, useMemo } from "react";

import config from "src/config";
import { generateId } from "src/common/utils/securityUtils";

export const AlertsContext = createContext(null);
export const AlerterContext = createContext(null);

export const AlerterProvider = ({ children }) => {
  // alerts state
  const [alerts, updateAlerts] = useImmer([]);
  // alerter state
  const alerter = useMemo(() => {
    // returning alerter object
    return {
      alertsLifeTime: config.alerter.alertsLifeTime,
      alertTypes: {
        error: "error",
        message: "message",
        success: "success",
        warning: "warning",
      },

      // --- Functions ---

      // create a new alert
      create: (type, text, isPersistant = false, onClick = null) => {
        console.log("create");
        console.log(type);
        console.log(text);
        if (!Object.values(alerter.alertTypes).includes(type)) {
          throw Error("invalid alert type");
        }

        updateAlerts((alerts) => {
          alerts.push({
            id: generateId(),
            type,
            text,
            isPersistant,
            onClick,
          });
        });
      },

      // delete a pre-existing alert
      delete: (id) => {
        updateAlerts((alerts) => {
          return alerts.filter((alert) => alert.id !== id);
        });
      },

      // clear all alerts
      clear: () => {
        updateAlerts(() => []);
      },
    };
  }, [updateAlerts]);

  return (
    <AlerterContext.Provider value={alerter}>
      <AlertsContext.Provider value={alerts}>{children}</AlertsContext.Provider>
    </AlerterContext.Provider>
  );
};
