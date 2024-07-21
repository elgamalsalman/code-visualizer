import React from "react";
import styles from "./App.module.css";

import config from "src/config";

import useFileTree from "src/hooks/useFileTree";
import useWindowTree from "src/hooks/useWindowTree";
import useOpenEditorStates from "src/hooks/useOpenEditorStates";
import useAutoSaver from "src/hooks/useAutoSaver";
import useRuns from "src/hooks/useRuns";

import Tile from "src/common/components/Tile/Tile";
import Header from "src/containers/Header/Header";
import FileTree from "src/containers/FileTree/FileTree";

const App = () => {
  const [fileTree, fileTreeInterface] = useFileTree();
  const [editorStates, openEditorStatesInterface] = useOpenEditorStates();
  const autoSaverInterface = useAutoSaver(editorStates);
  const [runs, runsInterface] = useRuns();
  const [renderWindowTree, windowTreeInterface] = useWindowTree(
    runs,
    openEditorStatesInterface,
    autoSaverInterface,
    runsInterface,
  );

  const runHandler = async () => {
    // save and create new run object
    await autoSaverInterface.save();
    windowTreeInterface.focusTab((tab) => tab.type === "console");
    runsInterface.run();
  };

  const killHandler = () => {
    runsInterface.kill();
  };

  return (
    <div className={styles["app"]}>
      <div className={styles["header-div"]}>
        <Header
          runEventHandlers={{
            runHandler: runHandler,
            killHandler: killHandler,
          }}
        />
      </div>
      <div className={styles["main-div"]}>
        <Tile transparent className={styles["file-tree-tile"]}>
          <FileTree
            fileTree={fileTree}
            fileTreeInterface={fileTreeInterface}
            autoSaverInterface={autoSaverInterface}
            windowTreeInterface={windowTreeInterface}
          />
        </Tile>
        <div className={styles["window-tree"]}>{renderWindowTree()}</div>
      </div>
    </div>
  );
};

export default App;
