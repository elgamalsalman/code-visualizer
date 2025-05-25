import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
} from "react";
import styles from "./ConsoleRun.module.css";

import {
  runStatuses,
  runDoneStatuses,
  runPendingStatuses,
} from "src/models/run/runModels";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  getUNIXTimeNow,
  UNIXToTime,
  UNIXToDate,
  millisToText,
} from "src/common/utils/dateTimeUtils";
import LoadingSpinner from "src/common/components/LoadingSpinner/LoadingSpinner";
import { CheckIcon } from "@heroicons/react/24/solid";
import { runEventConsoleDataTypes } from "src/models/run/runEventModels";

const statusToIconMap = {
  [runStatuses.connecting]: (
    <LoadingSpinner className={styles["icon"]} isSpinning={true} />
  ),
  [runStatuses.compiling]: (
    <LoadingSpinner className={styles["icon"]} isSpinning={true} />
  ),
  [runStatuses.running]: (
    <div className={`${styles["icon"]} ${styles["green-circle-icon"]}`}></div>
  ),
  [runStatuses.success]: <CheckIcon className={styles["icon"]} />,
  [runStatuses.failed]: <ExclamationTriangleIcon className={styles["icon"]} />,
  [runStatuses.killed]: <ExclamationTriangleIcon className={styles["icon"]} />,
};

function ConsoleRun({ run, onInput, onKill }) {
  const consoleRunId = useId();
  const [isOpen, setIsOpen] = useState(true);

  const runTimeDivId = `run-time-div-${consoleRunId}`;
  const getRunTime = () => {
    const endTime = runDoneStatuses.includes(run.status)
      ? run.endTime
      : getUNIXTimeNow();
    return endTime - run.startTime;
  };
  const timeUpdaterIntervalRef = useRef(null);

  // focus on active input on mount
  const activeInputId = `active-input-${consoleRunId}`;
  const focusOnActiveInput = () => {
    const activeInput = document.getElementById(activeInputId);
    activeInput.focus();
  };
  const previousRunStatusRef = useRef(null);
  useLayoutEffect(() => {
    if (
      run.status === runStatuses.running &&
      previousRunStatusRef.current !== runStatuses.running
    ) {
      focusOnActiveInput();
    }
    previousRunStatusRef.current = run.status;
  }, [run]);

  // Ctrl handling
  const isControlPressedRef = useRef(false);

  // time updating intervals
  useEffect(() => {
    if (runPendingStatuses.includes(run.status)) {
      timeUpdaterIntervalRef.current = setInterval(() => {
        const updateTime = () => {
          const timeDivId = document.getElementById(runTimeDivId);
          const time = getRunTime();
          if (timeDivId) timeDivId.innerText = millisToText(time);
          return time;
        };

        const time = updateTime();
        if (time > 1000) {
          clearInterval(timeUpdaterIntervalRef.current);
          timeUpdaterIntervalRef.current = setInterval(updateTime, 1000);
        }
      }, 100);
    }

    return () => {
      if (timeUpdaterIntervalRef.current) {
        clearInterval(timeUpdaterIntervalRef.current);
      }
    };
  }, [run]);

  return (
    <div className={styles["console-run"]}>
      <div className={styles["header"]}>
        <div className={styles["header-left-half"]}>
          <div
            className={styles["run-open-button"]}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronDownIcon className={styles["icon"]} />
            ) : (
              <ChevronRightIcon className={styles["icon"]} />
            )}
          </div>
          <div className={styles["run-label"]}>Run #{run.id}</div>
        </div>
        <div className={styles["header-right-half"]}>
          <div className={styles["run-time-div"]}>
            <div id={runTimeDivId} className={styles["run-duration-div"]}></div>
            <div className={styles["run-start-time-div"]}>
              on {UNIXToTime(run.startTime)} {UNIXToDate(run.startTime)}
            </div>
          </div>
          <div
            className={`${styles["run-status"]} ${styles[`run-status-${run.status}`]}`}
          >
            {statusToIconMap[run.status]}
          </div>
        </div>
      </div>
      <div
        className={`${styles["content"]} ${isOpen ? "" : styles["closed-content"]}`}
        onClick={focusOnActiveInput}
      >
        {run.data
          .filter((event) => runEventConsoleDataTypes.includes(event.type))
          .map(({ type, data }, index) => {
            return (
              <div key={index} className={styles[`content-type-${type}`]}>
                {data}
              </div>
            );
          })}
        <div
          id={activeInputId}
          className={styles["active-input"]}
          contentEditable={run.status === runStatuses.running}
          onKeyDown={(e) => {
            if (e.nativeEvent.key === "Enter") {
              e.preventDefault();
              e.target.innerHTML += "\n";
              onInput(e.target.innerHTML);
              e.target.innerHTML = "";
            } else if (e.nativeEvent.key === "Control") {
              isControlPressedRef.current = true;
            } else if (
              e.nativeEvent.key === "c" &&
              isControlPressedRef.current
            ) {
              e.target.innerHTML += "^C";
              onKill();
            }
          }}
          onKeyUp={(e) => {
            if (e.nativeEvent.key === "Control") {
              isControlPressedRef.current = false;
            }
          }}
          onBlur={() => {
            isControlPressedRef.current = false;
          }}
        ></div>
      </div>
    </div>
  );
}

export default ConsoleRun;
