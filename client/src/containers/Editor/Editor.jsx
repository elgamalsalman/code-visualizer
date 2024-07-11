import React, { useState, useId, useRef, useEffect } from "react";
import styles from "./Editor.module.css";

import config from "src/config";

import { EditorView } from "@codemirror/view";
import { createExternallyResolvablePromise } from "src/common/utils/promiseUtils";
import { generateHash } from "src/common/utils/securityUtils";
import { ReactComponent as EditorLoadingSkeleton } from "./editorLoadingSkeleton.svg";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";
import { entityTypes, getEntityMeta } from "src/models/entity/entityModels";

function Editor({ filePath, autoSaverInterface, openEditorStatesInterface }) {
  const editorId = useId();
  const [hasLoaded, setHasLoaded] = useState(false);

  const editorDivHTMLId = `cm-editor-${editorId}`;
  useEffect(() => {
    let view = null;
    let commonState = null;
    let updaterId = null;
    const subscriptionPromise = openEditorStatesInterface.subscribe(filePath);
    const editorCreationPromise = createExternallyResolvablePromise();

    // wait till state ref loads and update loaded state
    (async () => {
      commonState = await subscriptionPromise;
      updaterId = `${editorId}-${generateHash(8)}`;
      view = new EditorView({
        state: commonState.getState(),
        parent: document.getElementById(editorDivHTMLId),
        dispatchTransactions: (trs) => {
          // console.log(`dispatched at ${editorId}`);
          for (const tr of trs) {
            view.update([tr]);
            if (tr.changes && tr.docChanged) {
              autoSaverInterface.registerChangeEvent(
                filePath,
                getEntityEvent(
                  entityEventTypes.write,
                  getEntityMeta(filePath, entityTypes.file),
                ),
              );

              commonState.updateLastTransaction(tr);
              for (const id in commonState.updaters) {
                if (id !== updaterId) commonState.updaters[id](tr);
              }
            }
          }
        },
      });
      commonState.updaters[updaterId] = (changes) => {
        // console.log(`change reflected at ${editorId}`);
        view.update([view.state.update(changes)]);
      };
      editorCreationPromise.resolve();
      setHasLoaded(true);
    })();

    return () => {
      (async () => {
        await subscriptionPromise;
        await editorCreationPromise;
        delete commonState.updaters[updaterId];
        openEditorStatesInterface.unsubscribe(filePath);
        view.destroy();
      })();
    };
  }, []);

  return (
    <div className={styles["editor-outer-div"]}>
      {!hasLoaded && (
        <div className={styles["editor-loading-skeleton-outer-div"]}>
          <div className={styles["editor-loading-skeleton-inner-div"]}>
            <div className={styles["editor-loading-skeleton"]}>
              <EditorLoadingSkeleton />
            </div>
          </div>
        </div>
      )}
      <div id={editorDivHTMLId}></div>
    </div>
  );
}

export default Editor;
