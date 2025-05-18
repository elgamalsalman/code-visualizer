import React, { useEffect } from "react";
import clsx from "clsx";
import styles from "./Alert.module.css";

import useAlerter from "src/hooks/useAlerter";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Alert = ({
  id,
  type,
  text,
  isPersistant,
  onDelete: deleteHandler,
  onClick,
}) => {
  const [_, alerter] = useAlerter();

  // auto deletion after timeout
  useEffect(() => {
    if (isPersistant) return;

    const timeout = setTimeout(() => {
      deleteHandler();
    }, alerter.alertsLifeTime);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPersistant, deleteHandler, alerter.alertsLifeTime]);

  return (
    <div
      className={clsx(styles["alert"], styles[`alert-${type}`])}
      onClick={onClick}
    >
      <span>{text}</span>
      <div className={styles["alert-delete-button"]} onClick={deleteHandler}>
        <XMarkIcon />
      </div>
    </div>
  );
};

export default Alert;
