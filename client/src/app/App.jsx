import React, { useState, useEffect, useRef } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";

import config from "src/config";
import { getUNIXTimeNow } from "src/common/utils/dateTime";
import useAutoSave from "src/common/hooks/useAutoSave";

import { createRun, logRunEvent, terminateRun } from "src/redux/runs/runsSlice";
import { getRunEventTemplate } from "src/models/run/runEventModels";
import { entityTypes, getEntityData } from "src/models/entity/entityModels";
import { runStatuses } from "src/models/run/runModels";
import { updateServerEntities } from "src/api/fileService";
import useServerPullFileTree from "src/hooks/useServerPullFileTree";
import useMountFileTree from "src/hooks/useMountFileTree";

import Tile from "src/common/components/Tile/Tile";
import TabGroup from "src/components/TabGroup/TabGroup";
import Tab from "src/components/TabGroup/Tab";
import Header from "src/containers/Header/Header";
import Editor from "src/containers/Editor/Editor";
import Console from "src/containers/Console/Console";
import Grapher from "src/containers/Grapher/Grapher";

const App = () => {
  const dispatch = useDispatch();
  const runs = useSelector((state) => state.runs);

  const editorRef = useRef(null);
  const fileTree = useServerPullFileTree();
  useMountFileTree(fileTree);
  // TODO: useFileMetas(?filePaths);
  // create a model for the files
  // useServerPull should use an api function to request all entities
  // useMountFileTree should save file structure in redux
  // files: [{ path, isSaved }]
  // useFiles() should return a dictionary of the files
  // files: { path: {isSaved, getContent()} } // still needs thinking, filetree and rest, function in everythingy, too much?
  const [save, registerChange] = useAutoSave(async () => {
    const entities = [
      getEntityData(
        "main.cpp",
        entityTypes.file,
        true,
        editorRef.current.getValue(),
      ),
    ];
    await updateServerEntities(config.userId, entities);
    console.log(entities[0].content);
  }, config.autoSavingDelay);
  const runWSRef = useRef(null);

  const runHandler = async () => {
    // save and create new run object
    await save();
    dispatch(createRun({ startTime: getUNIXTimeNow() }));
  };

  return (
    <div className={styles["app"]}>
      <div className={styles["header-div"]}>
        <Header
          eventHandlers={{
            onRun: runHandler,
            onKill: () => {
              dispatch(
                terminateRun({
                  event: getRunEventTemplate.terminate(runStatuses.failed),
                  endTime: getUNIXTimeNow(),
                }),
              );
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
