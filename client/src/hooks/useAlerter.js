import { useContext } from "react";
import { AlertsContext, AlerterContext } from "src/contexts/alerterContexts";

const useAlerter = () => {
  const alerts = useContext(AlertsContext);
  const alerter = useContext(AlerterContext);
  return [alerts, alerter];
};

export default useAlerter;
