import React, { useState, useEffect, useRef } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";

import config from "src/config";
import { getUNIXTimeNow } from "src/common/utils/dateTime";
import useAutoSave from "src/common/hooks/useAutoSave";

import useAppRunningStatus from "src/hooks/useAppRunningStatus";
import { createRun, logRunEvent, terminateRun } from "src/redux/runs/runsSlice";
import { getRunEventTemplate } from "src/models/runs/runsEventsModels";

import Header from "src/common/components/Header/Header";
import Tile from "src/common/components/Tile/Tile";
import TabGroup from "src/components/TabGroup/TabGroup";
import Tab from "src/components/TabGroup/Tab";
import Editor from "src/containers/Editor/Editor";
import Console from "src/containers/Console/Console";
import Grapher from "src/containers/Grapher/Grapher";

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
  const dispatch = useDispatch();
  const runs = useSelector((state) => state.runs);
  const appRunningStatus = useAppRunningStatus();

  const editorRef = useRef(null);
  // TODO:  useServerPull();
  const [save, registerChange] = useAutoSave(async () => {
    const fileContent = editorRef.current.getValue();
    await syncWithServer(fileContent);
    console.log(fileContent);
  }, config.AutoSavingDelay);
  const runWSRef = useRef(null);

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

    // save and create new run object
    await save();
    dispatch(createRun({ startTime: getUNIXTimeNow() }));

    // initiate run in server
    runWSRef.current = new WebSocket(`${config.server.api.ws.url}/run`, [
      "json",
      config.testing.user_id,
    ]);
    runWSRef.current.addEventListener("open", (e) => {});
    runWSRef.current.addEventListener("message", (payload) => {
      const event = JSON.parse(payload.data);
      runEventHandler(event);
    });
  };

  const killHandler = (status = config.console.runStatuses.failed) => {
    dispatch(
      terminateRun({
        event: getRunEventTemplate.terminate(status),
        endTime: getUNIXTimeNow(),
      }),
    );
    runWSRef.current?.close();
    runWSRef.current = null;
  };

  console.log(runs);
  return (
    <div className={styles["app"]}>
      <div className={styles["header-div"]}>
        <Header
          runningStatus={appRunningStatus}
          eventHandlers={{
            onRun: runHandler,
            onKill: () => {
              killHandler(config.console.runStatuses.failed);
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
                <Console runs={runs} />
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
