import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./FileTree.module.css";

import {
  DocumentPlusIcon,
  FolderPlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import FileTreeEntity from "./FileTreeEntity";
import { entityTypes } from "src/models/entity/entityModels";

function FileTree({ registerEntityEvent, onFocusTab, onAddTab, onCloseTabs }) {
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);
  const fileTree = useSelector((state) => state.fileTree);
  const [newEntityPrompt, setNewEntityPrompt] = useState(null); // { path, type }

  if (!isFileTreeOpen) {
    return (
      <div className={styles["closed-file-tree-div"]}>
        <div
          className={styles["open-file-tree-button"]}
          onClick={() => {
            setIsFileTreeOpen(true);
          }}
        >
          <ChevronRightIcon className={styles["icon"]} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles["open-file-tree-div"]}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className={styles["header"]}>
        <div className={styles["title"]}>Files</div>
        <div className={styles["header-controls-div"]}>
          <div
            className={styles["new-file-button"]}
            onClick={() => {
              setNewEntityPrompt({ path: "", type: entityTypes.file });
            }}
          >
            <DocumentPlusIcon className={styles["icon"]} />
          </div>
          <div
            className={styles["new-dir-button"]}
            onClick={() => {
              setNewEntityPrompt({ path: "", type: entityTypes.dir });
            }}
          >
            <FolderPlusIcon className={styles["icon"]} />
          </div>
          <div
            className={styles["close-file-tree-button"]}
            onClick={() => {
              setIsFileTreeOpen(false);
            }}
          >
            <ChevronLeftIcon className={styles["icon"]} />
          </div>
        </div>
      </div>

      <div className={styles["file-tree-entities-div"]}>
        {/* FIXME: shouldn't depend on fileTree being null, but on app status */}
        {fileTree !== null && (
          <FileTreeEntity
            path={""}
            fileTree={fileTree}
            newEntityPrompt={newEntityPrompt}
            deleteNewEntityPrompt={() => {
              setNewEntityPrompt(null);
            }}
            registerEntityEvent={registerEntityEvent}
            onFocusTab={onFocusTab}
            onAddTab={onAddTab}
            onCloseTabs={onCloseTabs}
          />
        )}
      </div>
    </div>
  );
}

export default FileTree;
