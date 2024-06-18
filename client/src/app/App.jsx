import React, { useState, useEffect, useRef } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";

import config from "src/config";
import { getUNIXTimeNow } from "src/common/utils/dateTime";

import { createRun, logRunEvent, terminateRun } from "src/redux/runs/runsSlice";
import { getRunEventTemplate } from "src/models/run/runEventModels";
import { entityTypes, getEntityMeta } from "src/models/entity/entityModels";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";
import { runStatuses } from "src/models/run/runModels";
import useServerPullFileTree from "src/hooks/useServerPullFileTree";
import useMountFileTree from "src/hooks/useMountFileTree";
import useCanvasTree from "src/hooks/useCanvasTree";
import useOpenEditorModels from "src/hooks/useOpenEditorModels";
import useAutoSaveEntities from "src/hooks/useAutoSaveEntities";

import Tile from "src/common/components/Tile/Tile";
import TabGroup from "src/components/TabGroup/TabGroup";
import Tab from "src/components/TabGroup/Tab";
import Header from "src/containers/Header/Header";
import FileTree from "src/containers/FileTree/FileTree";
import Editor from "src/containers/Editor/Editor";
import Console from "src/containers/Console/Console";
import Grapher from "src/containers/Grapher/Grapher";

const App = () => {
  const dispatch = useDispatch();
  const runs = useSelector((state) => state.runs);

  // FIXME: editors always start with default content not the server file content
  const fileTree = useServerPullFileTree();
  useMountFileTree(fileTree);
  const [{ current: editorModelRefs }, subscribe, unsubscribe] =
    useOpenEditorModels(); // TODO: subscribe and unsubscribe
  const canvasTree = useCanvasTree(subscribe, unsubscribe); // TODO
  const [save, registerEntityEvent] = useAutoSaveEntities(editorModelRefs);
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
          <FileTree />
        </Tile>
        <div className={styles["canvas"]}>
          <Tile className={styles["editor-tile"]}>
            <TabGroup
              tabs={[
                <Tab key="main.cpp" title="main.cpp" type="code">
                  <Editor
                    model={editorModelRefs["main.cpp"]}
                    onChange={() =>
                      registerEntityEvent(
                        "main.cpp",
                        getEntityEvent(
                          entityEventTypes.write,
                          getEntityMeta("main.cpp", entityTypes.file),
                        ),
                      )
                    }
                  />
                </Tab>,
                <Tab key="headers/vector.h" title="vector.h" type="code">
                  <Editor
                    model={editorModelRefs["headers/vector.h"]}
                    onChange={() =>
                      registerEntityEvent(
                        "headers/vector.h",
                        getEntityEvent(
                          entityEventTypes.write,
                          getEntityMeta("headers/vector.h", entityTypes.file),
                        ),
                      )
                    }
                  />
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
    </div>
  );
};

export default App;
