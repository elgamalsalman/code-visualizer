import React, { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import styles from "./App.module.css";

import config from "config";
import { deepCopy } from "utils/objectUtils.js";

import Header from "components/Header/Header";
import Tile from "components/Tile/Tile";
import TabGroup from "components/TabGroup/TabGroup";
import Tab from "components/TabGroup/Tab";
import Editor from "components/Editor/Editor";
import Console from "components/Console/Console";
import Grapher from "components/Grapher/Grapher";

const syncWithServer = async (fileContent) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "test_user",
      updates: [
        {
          action: "write",
          path: "main.cpp",
          entity: "file",
          content: fileContent,
        },
      ],
    }),
  };
  const requestURL = `${config.server.api.url}/save`;
  const response = await fetch(requestURL, requestOptions);
  const data = await response.json();
  console.log(data);
};

const App = () => {
  const editorRef = useRef(null);
  const autoSavingTimerRef = useRef(null);
  const [runningStatus, setRunningStatus] = useState(
    config.appRunningStatuses.idle,
  );
  const runWSRef = useRef(null);
  const [idCounter, setIdCounter] = useState(config.testing.idCounter);
  const [pastRuns, updatePastRuns] = useImmer(config.testing.pastRuns);
  const [currRun, updateCurrRun] = useImmer(config.testing.currRun);

  const save = async () => {
    // if already up to date
    if (autoSavingTimerRef.current === null) return;

    // clear any auto-saving timers
    clearTimeout(autoSavingTimerRef.current);
    autoSavingTimerRef.current = null;

    const fileContent = editorRef.current.getValue();
    await syncWithServer(fileContent);
    console.log(fileContent);
  };

  // save on unmount
  useEffect(() => {
    return async () => {
      await save();
    };
  }, []);

  // registerChange
  const registerChange = () => {
    if (autoSavingTimerRef.current === null) {
      // schedule an auto-save
      autoSavingTimerRef.current = setTimeout(
        () => save(),
        config.autoSavingDelay,
      );
    }
  };

  const consoleUserInputHandler = (input) => {
    updateCurrRun((run) => {
      if (run === null) console.error("Can't take input without a valid run!");
      const inputType = config.console.runDataTypes.input;
      const lastDataPoint = run.data[run.data.length - 1];
      if (lastDataPoint?.type === inputType) {
        lastDataPoint.content += input;
      } else {
        run.data.push({
          type: inputType,
          content: input,
        });
      }
    });
  };

  const runHandler = async () => {
    // wait for editor to load up
    if (editorRef.current === null) return;

    // save and connect to server web socket
    setRunningStatus(config.appRunningStatuses.connecting);

    // save and create new run object
    await save();
    updateCurrRun((run) => {
      if (run !== null) console.error("Can't nest runs!");
      const newRun = deepCopy(config.console.runTemplate);
      newRun.id = idCounter;
      return deepCopy(newRun);
    });
    setIdCounter(idCounter + 1);

    // initiate run in server
    runWSRef.current = new WebSocket(`${config.server.api.ws.url}/run`, [
      "json",
      config.testing.user_id,
    ]);
    runWSRef.current.addEventListener("open", (e) => {
      setRunningStatus(config.appRunningStatuses.running);
    });
    runWSRef.current.addEventListener("message", (e) => {}); // TODO
    runWSRef.current.addEventListener("close", (e) => {
      runWSRef.current = null;
    });
  };

  const killHandler = (status = config.console.runStatuses.failed) => {
    const newPastRun = deepCopy(currRun);
    newPastRun.status = status;
    setRunningStatus(config.appRunningStatuses.idle);
    updatePastRuns((runs) => {
      runs.push(newPastRun);
    });
    updateCurrRun((run) => null);
    runWSRef.current.close();
  };

  const runs = [...pastRuns];
  if (runningStatus === config.console.runStatuses.running) runs.push(currRun);
  return (
    <div className={styles["app"]}>
      <div className={styles["header-div"]}>
        <Header
          runningStatus={runningStatus}
          eventHandlers={{
            onRun: runHandler,
            onKill: () => {
              killHandler(config.console.runStatuses.fialed);
            },
          }}
        />
      </div>
      <div className={styles["tiles-div"]}>
        <Tile className={styles["editor-tile"]}>
          <TabGroup
            tabs={[
              <Tab key="main.cpp" title="main.cpp" type="code">
                <Editor editorRef={editorRef} onChange={registerChange} />
              </Tab>,
            ]}
          />
        </Tile>
        <Tile className={styles["output-tile"]}>
          <TabGroup
            tabs={[
              <Tab key="Console" title="Console" type="console">
                <Console runs={runs} onInput={consoleUserInputHandler} />
              </Tab>,
              <Tab key="Grapher" title="Grapher" type="grapher">
                <Grapher />
              </Tab>,
            ]}
          />
        </Tile>
      </div>
    </div>
  );
};

export default App;
