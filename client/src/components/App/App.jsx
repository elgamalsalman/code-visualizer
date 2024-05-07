import React, { useEffect, useRef } from "react";
import styles from "./App.module.css";

import config from "config";

import Header from "components/Header/Header";
import Tile from "components/Tile/Tile";
import TabGroup from "components/TabGroup/TabGroup";
import Tab from "components/TabGroup/Tab";
import Editor from "components/Editor/Editor";
import Console from "components/Console/Console";
import Grapher from "components/Grapher/Grapher";

const App = () => {
  const editorRef = useRef(null);
  const autoSavingTimerRef = useRef(null);

  const save = () => {
    // clear any auto-saving timers
    clearTimeout(autoSavingTimerRef.current);
    autoSavingTimerRef.current = null;

    if (editorRef.current !== null) {
      const fileContent = editorRef.current.getValue();
      // TODO: syncToServer(fileContent);
      console.log(fileContent);
    }
  };

  // save on unmount
  useEffect(() => {
    save();
    return () => {
      clearTimeout(autoSavingTimerRef.current);
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

  return (
    <div className={styles["app"]}>
      <div className={styles["header-div"]}>
        <Header eventHandlers={{ onRun: save }} />
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
                <Console />
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
