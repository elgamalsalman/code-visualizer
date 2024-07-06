import React from "react";
import styles from "./WindowSplit.module.css";

function WindowSplit({ isMainAxis, windows }) {
  const directionalClassName = isMainAxis
    ? "horizontal-window-split"
    : "vetical-window-split";
  return (
    <div
      className={`${styles["window-split"]} ${styles[directionalClassName]}`}
    >
      {windows.map((window) => {
        return (
          <div key={window.props.id} className={styles["window-split-child"]}>
            {window}
          </div>
        );
      })}
    </div>
  );
}

export default WindowSplit;
