import React, { useState, useEffect } from "react";
import styles from "./FileTreeEntity.module.css";

import NewEntityPrompt from "./NewEntityPrompt";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

import { entityTypes } from "src/models/entity/entityModels";
import DynamicFileIcon from "src/common/components/DynamicFileIcon/DynamicFileIcon";
import DynamicDirIcon from "src/common/components/DynamicDirIcon/DynamicDirIcon";
import FileContextMenu from "./contextMenus/FileContextMenu";
import DirContextMenu from "./contextMenus/DirContextMenu";

const FileTreeEntity = ({
  path,
  fileTree,
  newEntityPrompt,
  deleteNewEntityPrompt,
  registerEntityEvent,
  onFocusTab,
  onAddTab,
}) => {
  const isFile = fileTree.type === entityTypes.file;
  const isDir = fileTree.type === entityTypes.dir;
  const [isDirOpen, setIsDirOpen] = useState(true);
  const [isContextMenuActive, setIsContextMenuActive] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const openContextMenu = (e) => {
    if (e.preventDefault) e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setIsContextMenuActive(true);
  };

  let dirChildren = null;
  if (isDir) {
    let newEntityPromptChildName, newEntityPromptChildPath;
    if (newEntityPrompt !== null) {
      const newEntityPromptPathEntities = newEntityPrompt.path.split("/");
      newEntityPromptChildName = newEntityPromptPathEntities[0];
      newEntityPromptChildPath = newEntityPromptPathEntities.slice(1).join("/");
    }
    dirChildren = [
      ...fileTree.children.map((child) => (
        <FileTreeEntity
          key={child.name}
          path={path === "" ? child.name : `${path}/${child.name}`}
          fileTree={child}
          newEntityPrompt={
            newEntityPromptChildName === child.name
              ? { ...newEntityPrompt, path: newEntityPromptChildPath }
              : null
          }
          deleteNewEntityPrompt={deleteNewEntityPrompt}
          onFocusTab={onFocusTab}
          onAddTab={onAddTab}
        />
      )),
    ];
    if (newEntityPrompt?.path === "") {
      dirChildren.push(
        <NewEntityPrompt
          key={"newEntityPrompt"}
          type={newEntityPrompt.type}
          onDeletion={deleteNewEntityPrompt}
          registerEntityEvent={registerEntityEvent}
        />,
      );
    }
  }

  return (
    <div>
      <div
        className={`${styles["entity-header"]} ${isFile ? styles["file-header"] : styles["dir-header"]}`}
      >
        <div
          className={styles["entity-header-clickable"]}
          onClick={() => {
            if (isFile) {
              if (!onFocusTab("editor", path)) {
                console.log(path);
                onAddTab("editor", path);
              }
            } else {
              setIsDirOpen((flag) => !flag);
            }
          }}
          onContextMenu={openContextMenu}
        >
          {isDir &&
            (isDirOpen ? (
              <ChevronDownIcon className={styles["icon"]} />
            ) : (
              <ChevronRightIcon className={styles["icon"]} />
            ))}
          <div className={styles["entity-icon-div"]}>
            {isFile ? (
              <DynamicFileIcon
                filename={fileTree.name}
                className={styles["icon"]}
              />
            ) : (
              <DynamicDirIcon
                dirname={fileTree.name}
                className={styles["icon"]}
                isOpen={isDirOpen}
              />
            )}
          </div>
          <div className={styles["entity-name"]}>{fileTree.name}</div>
        </div>
        <div
          className={styles["entity-menu-button"]}
          onClick={openContextMenu}
          onContextMenu={openContextMenu}
        >
          <EllipsisVerticalIcon className={styles["icon"]} />
        </div>
      </div>
      {isDir && (
        <div
          className={`${styles["dir-children-div"]} ${!isDirOpen ? styles["closed-dir-children-div"] : ""}`}
        >
          {dirChildren.length > 0 ? (
            dirChildren
          ) : (
            <div className={styles["empty-dir-message"]}>empty</div>
          )}
        </div>
      )}

      {isFile ? (
        <FileContextMenu
          isActive={isContextMenuActive}
          position={contextMenuPosition}
          onBlur={() => setIsContextMenuActive(false)}
        />
      ) : (
        <DirContextMenu
          isActive={isContextMenuActive}
          position={contextMenuPosition}
          onBlur={() => setIsContextMenuActive(false)}
        />
      )}
    </div>
  );
};

export default FileTreeEntity;
