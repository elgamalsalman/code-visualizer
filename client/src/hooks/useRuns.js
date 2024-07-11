import { useRef } from "react";
import { useImmer } from "use-immer";

import { getNewRun, runStatuses } from "src/models/run/runModels";
import { useAppStatusContext } from "./useAppStatusContext";
import { appStatuses } from "src/models/app/appModels";
import { getUNIXTimeNow } from "src/common/utils/dateTime";

const useRuns = () => {
  const [appStatus, setAppStatus] = useAppStatusContext();
  const [runs, updateRuns] = useImmer([]);
  const wsRef = useRef(null);

  // creates a new run only if available, doesn't save automatically!
  const addRun = () => {
    if (appStatus === appStatuses.idle) {
      const newRun = getNewRun(runs.length, getUNIXTimeNow());
      updateRuns((runs) => {
        runs.push(newRun);
      });
      setAppStatus(appStatuses.pending);

      // TODO: setup a websocket connectino for the run

      return true; // success
    } else return false;
  };

  const killRun = () => {
    if (appStatus === appStatuses.running) {
      // TODO: kill the websocket connection and get any output produced after killing and add to the run outputs and only then set run status to killed

      updateRuns((runs) => {
        const lastRun = runs[runs.length - 1];
        lastRun.status = runStatuses.killed;
        lastRun.endTime = getUNIXTimeNow();
      });

      return true;
    } else return false;
  };

  const handleInput = () => {
    if (appStatus === appStatus.running) {
      // TODO send input through websocket

      return true;
    } else return false;
  };

  const runsInterface = {
    run: addRun,
    kill: killRun,
    input: handleInput,
  };

  return [runs, runsInterface];
};

export default useRuns;
