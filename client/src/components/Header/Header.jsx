import React from "react";
import styles from "./Header.module.css";

import RunButton from "components/RunButton/RunButton";

const Header = ({ eventHandlers }) => {
  const { onRun } = eventHandlers;
  return (
    <header className={styles["header"]}>
      <div className={styles["run-button-div"]}>
        <RunButton onClick={onRun} />
      </div>
    </header>
  );
};

export default Header;
