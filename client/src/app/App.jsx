import React, { useState, useEffect, useRef } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";

import config from "src/config";
import { getUNIXTimeNow } from "src/common/utils/dateTime";
import useAutoSave from "src/common/hooks/useAutoSave";

import { createRun, logRunEvent, terminateRun } from "src/redux/runs/runsSlice";
import { getRunEventTemplate } from "src/models/run/runEventModels";
import {
  entityTypes,
  getEntityMeta,
  getEntityData,
} from "src/models/entity/entityModels";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";
import { runStatuses } from "src/models/run/runModels";
import { pushEntityEventsToServer } from "src/api/entityService";
import {
  readFileFromLocalStorage,
  writeFileToLocalStorage,
} from "src/services/localStorageService";
import useServerPullFileTree from "src/hooks/useServerPullFileTree";
import useMountFileTree from "src/hooks/useMountFileTree";

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

  const editorRef = useRef(null);
  const fileTree = useServerPullFileTree();
  useMountFileTree(fileTree);
  // const editorRefs = useEditorRefMap();
  const [save, registerFileChange] = useAutoSave(async (changes) => {
    const locallyProcessedEntityEvents = await Promise.all(
      changes.map(async (entityEvent) => {
        if (
          [entityEventTypes.create, entityEventTypes.write].includes(
            entityEvent.type,
          ) &&
          entityEvent.entity.type === entityTypes.file
        ) {
          // TODO: this should take from a more complicated structure of editorRefs
          // to allow for multiple editor refs at once
          // TODO: this be a call to a function that syncs editorRefs to localstorage
          // and another that syncs localstorage to server, that is it
          let fileContent = editorRef.current?.getValue();
          // TODO: if editor no longer exists take info from localstorage
          if (!fileContent) {
            fileContent = await readFileFromLocalStorage(entityEvent.entity);
          }
          const entity = getEntityData(
            entityEvent.entity.path,
            entityTypes.file,
            undefined,
            fileContent,
          );
          await writeFileToLocalStorage(entity);

          entityEvent.entity = entity;
        }

        return entityEvent;
      }),
    );
    await pushEntityEventsToServer(config.userId, locallyProcessedEntityEvents);
    console.log("saved to server!");
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
                    editorRef={editorRef}
                    onChange={() =>
                      registerFileChange(
                        "main.cpp",
                        getEntityEvent(
                          entityEventTypes.write,
                          getEntityMeta("main.cpp", entityTypes.file),
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
