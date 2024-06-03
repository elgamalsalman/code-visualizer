import React from "react";
import styles from "./RunButton.module.css";

// FIXME: shouldn't really depend on config
import config from "src/config";

import { PlayIcon, ArrowPathIcon, StopIcon } from "@heroicons/react/24/solid";

const RunButton = ({ runningStatus, onRun, onKill }) => {
  const modes = {
    [config.appRunningStatuses.idle]: {
      buttonMode: "run",
      onClick: onRun,
      icon: <PlayIcon className={styles["icon"]} />,
      text: "Run",
    },
    [config.appRunningStatuses.connecting]: {
      buttonMode: "connecting",
      onClick: () => {},
      icon: <ArrowPathIcon className={styles["icon"]} />,
      text: "Working",
    },
    [config.appRunningStatuses.running]: {
      buttonMode: "stop",
      onClick: onKill,
      icon: <StopIcon className={styles["icon"]} />,
      text: "Stop",
    },
  };
  return (
    <button
      onClick={modes[runningStatus].onClick}
      className={`${styles["run-button"]} ${styles[`run-button-${modes[runningStatus].buttonMode}`]}`}
    >
      {modes[runningStatus].icon}
      <span>{modes[runningStatus].text}</span>
    </button>
  );
};

export default RunButton;
