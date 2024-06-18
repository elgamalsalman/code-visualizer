import React, { useState } from "react";
import styles from "./FileTreeEntity.module.css";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

import { entityTypes } from "src/models/entity/entityModels";
import DynamicFileIcon from "src/common/components/DynamicFileIcon/DynamicFileIcon";
import DynamicDirIcon from "src/common/components/DynamicDirIcon/DynamicDirIcon";

const FileTreeEntity = ({ fileTree }) => {
  const [isDirOpen, setIsDirOpen] = useState(true);

  if (fileTree.type === entityTypes.file) {
    return (
      <div className={`${styles["entity-header"]} ${styles["file-header"]}`}>
        <div className={styles["entity-header-clickable"]}>
          <div>
            <DynamicFileIcon
              filename={fileTree.name}
              className={styles["icon"]}
            />
          </div>
          <div className={styles["entity-name"]}>{fileTree.name}</div>
        </div>
        <div className={styles["entity-menu-button"]}>
          <EllipsisVerticalIcon className={styles["icon"]} />
        </div>
      </div>
    );
  } else if (fileTree.type === entityTypes.dir) {
    return (
      <div>
        <div className={`${styles["entity-header"]} ${styles["dir-header"]}`}>
          <div
            className={styles["entity-header-clickable"]}
            onClick={() => {
              setIsDirOpen((flag) => !flag);
            }}
          >
            {isDirOpen ? (
              <ChevronDownIcon className={styles["icon"]} />
            ) : (
              <ChevronRightIcon className={styles["icon"]} />
            )}
            <div className={styles["entity-icon-div"]}>
              <DynamicDirIcon
                dirname={fileTree.name}
                className={styles["icon"]}
                isOpen={isDirOpen}
              />
            </div>
            <div className={styles["entity-name"]}>{fileTree.name}</div>
          </div>
          <div className={styles["entity-menu-button"]}>
            <EllipsisVerticalIcon className={styles["icon"]} />
          </div>
        </div>

        {isDirOpen && (
          <div className={styles["dir-children-div"]}>
            {fileTree.children.length > 0 ? (
              fileTree.children.map((child) => (
                <FileTreeEntity fileTree={child} />
              ))
            ) : (
              <div className={styles["empty-dir-message"]}>empty</div>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default FileTreeEntity;
