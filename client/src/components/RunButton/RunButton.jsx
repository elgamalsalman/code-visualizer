import React from "react";
import styles from "./RunButton.module.css";

import { PlayIcon } from "@heroicons/react/24/solid";

const RunButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles["run-button"]}>
      <PlayIcon className={styles["play-icon"]} />
      <span>Run</span>
    </button>
  );
};

export default RunButton;
