import React, { useRef, useEffect } from "react";
import styles from "./Console.module.css";

import ConsoleRun from "./ConsoleRun";
import RunButton, {
  runButtonStatuses,
} from "src/common/components/RunButton/RunButton";
import { appStatuses } from "src/models/app/appModels";
import { useAppStatusContext } from "src/hooks/useAppStatusContext";

const Console = ({ runs, runsInterface }) => {
  const consoleEndRef = useRef(null);
  const [appStatus, _] = useAppStatusContext();

  // Scroll to bottom when runs change
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  return (
    <div className={styles["console-div"]}>
      {runs.length === 0 ? (
        <div className={styles["empty-console-content"]}>
          <div className={styles["empty-console-message-div"]}>
            <p className={styles["empty-console-message-title"]}>
              Run your code!
            </p>
            <p className={styles["empty-console-message-legend"]}>
              Test, interact and visualize its inner workings!
            </p>
          </div>
          <RunButton
            status={
              appStatus === appStatuses.pending
                ? runButtonStatuses.pending
                : runButtonStatuses.run
            }
            onRun={runsInterface.run}
            className={styles["run-button"]}
          />
        </div>
      ) : (
        <div className="runs-div">
          {runs.map((run, index) => (
            <ConsoleRun
              key={run.id}
              run={run}
              onInput={index === runs.length - 1 ? runsInterface.input : null}
              onKill={index === runs.length - 1 ? runsInterface.kill : null}
            />
          ))}
          <div ref={consoleEndRef} />
        </div>
      )}
    </div>
  );
};

export default Console;
