import React, { useState, useEffect, useRef } from "react";
import styles from "./NewEntityPrompt.module.css";

import DynamicFileIcon from "src/common/components/DynamicFileIcon/DynamicFileIcon";
import DynamicDirIcon from "src/common/components/DynamicDirIcon/DynamicDirIcon";
import {
  entityTypes,
  getEntityData,
  getEntityMeta,
} from "src/models/entity/entityModels";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";

function NewEntityPrompt({
  type,
  onDeletion,
  fileTreeInterface,
  autoSaverInterface,
  windowTreeInterface,
}) {
  const textareaRef = useRef(null);
  const [path, setPath] = useState("");
  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  return (
    <div className={styles["new-entity-prompt"]}>
      {type === entityTypes.file ? (
        <DynamicFileIcon className={styles["icon"]} filename={path} />
      ) : (
        <DynamicDirIcon
          className={styles["icon"]}
          dirname={path}
          isOpen={false}
        />
      )}
      <textarea
        ref={textareaRef}
        className={styles["textarea"]}
        value={path}
        onChange={(e) => setPath(e.target.value)}
        onBlur={() => {
          onDeletion();
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            const newEntity = getEntityData(
              path,
              type,
              undefined,
              type === entityTypes.file ? "" : undefined,
            );
            const entityEvent = getEntityEvent(
              entityEventTypes.create,
              newEntity,
            );

						// update the file tree
            fileTreeInterface.createEntity(
              getEntityMeta(path, type, undefined),
            );
						// register for saving
            autoSaverInterface.registerChangeEvent(path, entityEvent);
            // open if file
            if (type === entityTypes.file) {
              windowTreeInterface.addTab({ type: "editor", path: path });
            }
            onDeletion();
          } else if (event.key === "Escape") {
            onDeletion();
          }
        }}
        rows={1}
      />
    </div>
  );
}

export default NewEntityPrompt;
