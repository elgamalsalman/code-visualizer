import React from "react";
import styles from "./Header.module.css";

import RunButton from "common/components/RunButton/RunButton";

const Header = ({ runningStatus, eventHandlers }) => {
  const { onRun, onKill } = eventHandlers;
  return (
    <header className={styles["header"]}>
      <div className={styles["run-button-div"]}>
        <RunButton
          runningStatus={runningStatus}
          onRun={onRun}
          onKill={onKill}
        />
      </div>
    </header>
  );
};

export default Header;
