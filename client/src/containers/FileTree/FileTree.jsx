import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./FileTree.module.css";

import {
  DocumentPlusIcon,
  FolderPlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import FileTreeEntity from "./FileTreeEntity";

function FileTree() {
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);
  const fileTree = useSelector((state) => state.fileTree);

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
    <div className={styles["open-file-tree-div"]}>
      <div className={styles["header"]}>
        <div className={styles["title"]}>Files</div>
        <div className={styles["header-controls-div"]}>
          <div
            className={styles["new-file-button"]}
            onClick={() => {
              // TODO: create new file
              console.log("creating new file");
            }}
          >
            <DocumentPlusIcon className={styles["icon"]} />
          </div>
          <div
            className={styles["new-dir-button"]}
            onClick={() => {
              // TODO: create new directory
              console.log("creating new directory");
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
        {fileTree !== null && <FileTreeEntity fileTree={fileTree} />}
      </div>
    </div>
  );
}

export default FileTree;
