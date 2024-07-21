import React, { useState, useEffect } from "react";
import styles from "./Grapher.module.css";

import { appStatuses } from "src/models/app/appModels";

import { useAppStatusContext } from "src/hooks/useAppStatusContext";
import GrapherInsert from "./GrapherInsert";
import RunButton, {
  runButtonStatuses,
} from "src/common/components/RunButton/RunButton";
import ConsoleRun from "../Console/ConsoleRun";

const Grapher = ({ runs, runsInterface }) => {
  const [appStatus, _] = useAppStatusContext();

  let run = null;
  if (runs.length > 0) run = runs[runs.length - 1];

  const isRunAvailable = run !== null;
  return (
    <div className={styles["grapher-div"]}>
      <div className={styles["grapher-canvas"]}>
        <GrapherInsert run={run} showMiniMap />

        {!isRunAvailable && (
          <div className={styles["no-run-message-div"]}>
            <div className={styles["no-run-message"]}>
              <div className={styles["no-run-message-text"]}>
                <p className={styles["no-run-message-title"]}>Run your code!</p>
                <p className={styles["no-run-message-legend"]}>
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
          </div>
        )}
      </div>
      <div className={styles["console-run-div"]}>
        {run && (
          <ConsoleRun
            run={run}
            onInput={runsInterface.input}
            onKill={runsInterface.kill}
          />
        )}
      </div>
    </div>
  );
};

export default Grapher;
