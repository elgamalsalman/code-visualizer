import React from "react";
import styles from "./Alerter.module.css";

import useAlerter from "src/hooks/useAlerter";
import Alert from "./Alert";

const Alerter = () => {
  const [alerts, alerter] = useAlerter();

  return (
    <div className={styles["alerts-list"]}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          text={alert.text}
          isPersistant={alert.isPersistant}
          onDelete={() => alerter.delete(alert.id)}
          onClick={alert.onClick}
        />
      ))}
    </div>
  );
};

export default Alerter;
