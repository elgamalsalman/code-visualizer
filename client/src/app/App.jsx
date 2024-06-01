import React, { useState, useEffect, useRef } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import styles from "./App.module.css";

import config from "config";
import { deepCopy } from "common/utils/objectUtils.js";

import Header from "common/components/Header/Header";
import Tile from "common/components/Tile/Tile";
import TabGroup from "components/TabGroup/TabGroup";
import Tab from "components/TabGroup/Tab";
import Editor from "containers/Editor/Editor";
import Console from "containers/Console/Console";
import Grapher from "containers/Grapher/Grapher";

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

const pastRunsReducer = (runs, action) => {
  switch (action.type) {
    case "add": {
      console.log("add");
      runs.push(action.newRun);
      break;
    }
  }
};

const currRunReducer = (run, action) => {
  switch (action.type) {
    case "new": {
      console.log("new");
      return {
        ...deepCopy(config.console.runTemplate),
        id: action.id,
      };
      break;
    }
    case "reset": {
      console.log("reset");
      return null;
      break;
    }

    case "input":
    case "output":
    case "error": {
      const lastDataPoint = run.data[run.data.length - 1];
      if (lastDataPoint?.type === action.type) {
        lastDataPoint.content += action.content;
      } else {
        run.data.push({
          type: config.console.runDataTypes[action.type],
          content: action.content,
        });
      }
      break;
    }
  }
};

const App = () => {
  const editorRef = useRef(null);
  const autoSavingTimerRef = useRef(null);
  const [runningStatus, setRunningStatus] = useState(
    config.appRunningStatuses.idle,
  );
  const runWSRef = useRef(null);
  const [idCounter, setIdCounter] = useState(config.testing.idCounter);
  const [pastRuns, pastRunsDispatch] = useImmerReducer(
    pastRunsReducer,
    config.testing.pastRuns,
  );
  const [currRun, currRunDispatch] = useImmerReducer(
    currRunReducer,
    config.testing.currRun,
  );

  console.log(`pastRuns: ${pastRuns}`);
  console.log(`currRun: ${currRun}`);

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

  const getRunIOHandler = (type) => {
    return (io) => {
      currRunDispatch({
        type: type,
        content: io,
      });
    };
  };

  const runEventHandler = (event) => {
    console.log(event);
    if (event.type === "output" || event.type === "error") {
      // FIXME
      // getRunIOHandler(event.type)(event.content);
    } else if (event.type === "exit") {
      killHandler(event.status);
    }
    // TODO: rest of event types
  };

  const runHandler = async () => {
    // wait for editor to load up
    if (editorRef.current === null) return;

    // save and connect to server web socket
    setRunningStatus(config.appRunningStatuses.connecting);

    // save and create new run object
    await save();
    currRunDispatch({ type: "new", id: idCounter });
    setIdCounter(idCounter + 1);

    // initiate run in server
    runWSRef.current = new WebSocket(`${config.server.api.ws.url}/run`, [
      "json",
      config.testing.user_id,
    ]);
    runWSRef.current.addEventListener("open", (e) => {
      setRunningStatus(config.appRunningStatuses.running);
    });
    runWSRef.current.addEventListener("message", (payload) => {
      const event = JSON.parse(payload.data);
      runEventHandler(event);
    });
  };

  const killHandler = (status = config.console.runStatuses.failed) => {
    setRunningStatus(config.appRunningStatuses.idle);
    pastRunsDispatch({
      type: "add",
      newRun: {
        ...deepCopy(currRun),
        status: status,
      },
    });
    currRunDispatch({ type: "reset" });
    runWSRef.current?.close();
    runWSRef.current = null;
  };

  const runs = [...deepCopy(pastRuns)];
  console.log(runs);
  console.log(currRun);
  if (runningStatus === config.console.runStatuses.running)
    runs.push(deepCopy(currRun));
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
                <Console runs={runs} onInput={getRunIOHandler("input")} />
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
