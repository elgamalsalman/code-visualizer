import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NewEntityPrompt.module.css";

import DynamicFileIcon from "src/common/components/DynamicFileIcon/DynamicFileIcon";
import DynamicDirIcon from "src/common/components/DynamicDirIcon/DynamicDirIcon";
import { entityTypes, getEntityData } from "src/models/entity/entityModels";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";
import { updateEntity } from "src/redux/fileTree/fileTreeSlice";

function NewEntityPrompt({ type, onDeletion, registerEntityEvent }) {
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
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
        onKeyDown={(event) => {
          console.log(event.key);
          if (event.key === "Enter") {
            const entityEvent = getEntityEvent(
              entityEventTypes.create,
              getEntityData(
                path,
                type,
                undefined,
                type === entityTypes.file ? "" : undefined,
              ),
            );
            dispatch(updateEntity(entityEvent));
            registerEntityEvent(path, entityEvent);
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
