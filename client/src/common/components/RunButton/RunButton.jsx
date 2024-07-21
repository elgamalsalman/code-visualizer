import React from "react";
import styles from "./RunButton.module.css";

import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "src/common/components/LoadingSpinner/LoadingSpinner";

const runButtonStatuses = {
  run: "run",
  pending: "pending",
  kill: "kill",
};

const RunButton = ({ status, onRun, onKill, className }) => {
  const mode = {
    [runButtonStatuses.run]: {
      onClick: onRun,
      icon: <PlayIcon className={styles["icon"]} />,
      text: "Run",
    },
    [runButtonStatuses.pending]: {
      onClick: () => {},
      icon: <LoadingSpinner className={styles["icon"]} isSpinning={true} />,
      text: "Working",
    },
    [runButtonStatuses.kill]: {
      onClick: onKill,
      icon: <StopIcon className={styles["icon"]} />,
      text: "Stop",
    },
  }[status];

  return (
    <button
      onClick={mode.onClick}
      className={`${className ? className : ""} ${styles["run-button"]} ${styles[`run-button-${status}`]}`}
    >
      {mode.icon}
      <span>{mode.text}</span>
    </button>
  );
};

export { runButtonStatuses };
export default RunButton;
