import React from "react";
import styles from "./ConsoleRun.module.css";

import config from "src/config";

import { runStatuses } from "src/models/run/runModels";

function ConsoleRun({ run, logInput }) {
  const { id, data, status } = run;

  const handleInput = (e) => {
    // assertion
    if (e.nativeEvent.type !== "input") {
      console.error("A non-input native event type for textarea of ConsoleRun");
      return;
    }

    let inputType = e.nativeEvent.inputType;
    let data = e.nativeEvent.data;
    if (inputType === "insertLineBreak") {
      inputType = "insertText";
      data = "\n";
    }

    if (inputType === "insertText" || inputType === "insertFromPaste") {
      logInput(data);
    } else if (inputType === "deleteContentBackward") {
      // skip, minor feature: todo later
    } else if (inputType === "deleteContentForward") {
      // skip, minor feature: todo later
    }
  };

  const defaultRowCount = config.console.defaultRowCount;
  return (
    <div>
      <div className={styles["header"]}>Run #{id}</div>
      <div className={styles["content"]}>
        {data.map(({ type, content }, index) => {
          return (
            <span key={index} className={styles[`content-type-${type}`]}>
              {content}
            </span>
          );
        })}
      </div>
      <textarea
        className="text-input-area"
        readOnly={status !== runStatuses.running}
        value={""}
        onChange={handleInput}
        rows={defaultRowCount}
      />
    </div>
  );
}

export default ConsoleRun;
