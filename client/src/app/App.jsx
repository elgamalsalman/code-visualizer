import React, { useId, useState, useEffect, useRef } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";

import config from "src/config";
import { getUNIXTimeNow } from "src/common/utils/dateTime";

import { createRun, logRunEvent, terminateRun } from "src/redux/runs/runsSlice";
import { getRunEventTemplate } from "src/models/run/runEventModels";
import { runStatuses } from "src/models/run/runModels";
import useServerPullFileTree from "src/hooks/useServerPullFileTree";
import useMountFileTree from "src/hooks/useMountFileTree";
import useWindowTree from "src/hooks/useWindowTree";
import useOpenEditorStates from "src/hooks/useOpenEditorStates";
import useAutoSaveEntities from "src/hooks/useAutoSaveEntities";

import Tile from "src/common/components/Tile/Tile";
import Header from "src/containers/Header/Header";
import FileTree from "src/containers/FileTree/FileTree";

const App = () => {
  const dispatch = useDispatch();

  const fileTree = useServerPullFileTree();
  useMountFileTree(fileTree);
  const [{ current: editorStates }, subscribe, unsubscribe] =
    useOpenEditorStates();
  const [save, registerEntityEvent] = useAutoSaveEntities(editorStates);
  const [renderWindowTree, focusTab, addTab] = useWindowTree(
    subscribe,
    unsubscribe,
    editorStates,
    registerEntityEvent,
  );
  const runWSRef = useRef(null);

  const runHandler = async () => {
    // save and create new run object
    await save();
    dispatch(createRun({ startTime: getUNIXTimeNow() }));
  };

  const killHandler = () => {
    dispatch(
      terminateRun({
        event: getRunEventTemplate.terminate(runStatuses.failed),
        endTime: getUNIXTimeNow(),
      }),
    );
  };

  return (
    <div className={styles["app"]}>
      <div className={styles["header-div"]}>
        <Header
          eventHandlers={{
            onRun: runHandler,
            onKill: killHandler,
          }}
        />
      </div>
      <div className={styles["main-div"]}>
        <Tile transparent className={styles["file-tree-tile"]}>
          <FileTree
            onFocusTab={focusTab}
            onAddTab={addTab}
            registerEntityEvent={registerEntityEvent}
          />
        </Tile>
        <div className={styles["window-tree"]}>{renderWindowTree()}</div>
      </div>
    </div>
  );
};

export default App;
