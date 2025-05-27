import config from "src/config";

import { useRef } from "react";
import { useImmer } from "use-immer";

import api from "src/api/api";

import { getUNIXTimeNow } from "src/common/utils/dateTimeUtils";
import { getRun, runStatuses } from "src/models/run/runModels";
import { useAppStatusContext } from "./useAppStatusContext";
import { appStatuses } from "src/models/app/appModels";
import {
  getRunEvent,
  runEventConsoleDataTypes,
  runEventDataTypes,
  runEventStatuses,
  runEventTypes,
} from "src/models/run/runEventModels";

const useRuns = () => {
  const [appStatus, setAppStatus] = useAppStatusContext();
  const [runs, updateRuns] = useImmer([]);
  const wsRef = useRef(null);

  const updateLastRun = (updater) => {
    updateRuns((runs) => {
      if (runs.length === 0) {
        console.error("Attempting to edit last run but it doesn't exist");
      } else {
        updater(runs[runs.length - 1]);
      }
    });
  };

  const logRunDataEvent = (run, event) => {
    if (!runEventDataTypes.includes(event.type)) {
      console.log(
        "logging an event with a type not included in the run event data types!",
      );
      return;
    }

    // combine console data types when possible
    if (
      run.data.length === 0 ||
      !runEventConsoleDataTypes.includes(run.data[run.data.length - 1].type) ||
      run.data[run.data.length - 1].type !== event.type
    ) {
      run.data.push(event);
    } else {
      const lastEvent = run.data[run.data.length - 1];
      lastEvent.data = lastEvent.data + event.data;
    }
  };

  // creates a new run only if available, doesn't save automatically!
  const addRun = () => {
    if (appStatus === appStatuses.idle) {
      const newRun = getRun(runs.length, getUNIXTimeNow());
      updateRuns((runs) => {
        runs.push(newRun);
      });
      setAppStatus(appStatuses.pending);

      wsRef.current = api.runs.run();
      wsRef.current.onmessage = (payload) => {
        if (payload.type === "message") {
          const event = JSON.parse(payload.data);
          console.log(event);
          if (event.type === runEventTypes.connection) {
            if ((event.status = runEventStatuses.success)) {
              updateLastRun((run) => {
                run.status = runStatuses.compiling;
              });
            } else console.log("Failed to connect!");
          } else if (event.type === runEventTypes.compilation) {
            if ((event.status = runEventStatuses.success)) {
              updateLastRun((run) => {
                run.status = runStatuses.running;
              });
              setAppStatus(runStatuses.running);
            } else console.log("Failed to compile!");
          } else if (runEventDataTypes.includes(event.type)) {
            updateLastRun((run) => {
              logRunDataEvent(run, event);
            });
          } else if (event.type === runEventTypes.error) {
            updateLastRun((run) => {
              if (run.error === null) run.error = "";
              run.error = run.error + event.error;
            });
          } else if (event.type === runEventTypes.terminate) {
            updateLastRun((run) => {
              run.status =
                event.status === runEventStatuses.success
                  ? runStatuses.success
                  : runStatuses.failed;
              run.endTime = getUNIXTimeNow();
            });
            wsRef.current.close();
            setAppStatus(appStatuses.idle);
          } else {
            console.log(`received the unknown runEventType of ${event.type}`);
          }
        } else {
          console.log("received an unknown ws event!");
          console.log(payload);
        }
      };

      return true; // successfully added run
    } else return false;
  };

  const killRun = () => {
    if (appStatus === appStatuses.running) {
      // TODO: kill the websocket connection and get any output produced after killing and add to the run outputs and only then set run status to killed
      wsRef.current.send(
        JSON.stringify(getRunEvent.terminate(runEventStatuses.killed)),
      );
      wsRef.current.close();

      updateLastRun((run) => {
        run.status = runStatuses.killed;
        run.endTime = getUNIXTimeNow();
      });
      setAppStatus(appStatuses.idle);

      return true;
    } else return false;
  };

  const handleInput = (data) => {
    if (appStatus === appStatuses.running) {
      if (!wsRef.current) console.error("input but no websocket!");

      // send input through websocket and add to run data
      const event = getRunEvent.stdin(data);
      updateLastRun((run) => {
        logRunDataEvent(run, event);
      });
      wsRef.current.send(JSON.stringify(event));

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
