import { useRef } from "react";

import config from "src/config";
import { createExternallyResolvablePromise } from "src/common/utils/promiseUtils";

import {
  entityTypes,
  getEntityMeta,
  getEntityData,
} from "src/models/entity/entityModels";
import { pullServerEntities } from "src/api/entityService";
import {
  readFileFromStorage,
  writeFileToStorage,
} from "src/services/storageService";
import { getNewEditorState } from "src/containers/Editor/editorState";

const useOpenEditorStates = () => {
  const statesRef = useRef({});

  const subscribe = async (fileId) => {
    // console.log(`subscribing to ${fileId}`);

    if (statesRef.current[fileId] === undefined) {
      statesRef.current[fileId] = {
        count: 1,
        updaters: {},
        _state: null,
        _lastTransaction: null,
        hasLoadedPromise: createExternallyResolvablePromise(),
        updateLastTransaction: (tr) => {
          statesRef.current[fileId]._lastTransaction = tr;
        },
        getState: () => {
          if (statesRef.current[fileId]._lastTransaction !== null) {
            statesRef.current[fileId]._state =
              statesRef.current[fileId]._lastTransaction.state;
            statesRef.current[fileId]._lastTransaction = null;
          }
          return statesRef.current[fileId]._state;
        },
      };

      // get content from either of local storage or server
      let content = await readFileFromStorage(
        getEntityMeta(fileId, entityTypes.file, undefined),
      );
      if (content === null) {
        try {
          [{ content }] = await pullServerEntities(config.userId, [
            getEntityMeta(fileId, entityTypes.file, undefined),
          ]);
          const entity = getEntityData(
            fileId,
            entityTypes.file,
            undefined,
            content,
          );
          await writeFileToStorage(entity);
        } catch (err) {
          console.log(err);
        }
      }

      statesRef.current[fileId]._state = getNewEditorState(content);
      statesRef.current[fileId].hasLoadedPromise.resolve();
    } else {
      await statesRef.current[fileId].hasLoadedPromise;
      statesRef.current[fileId].count++;
    }

    // console.log(`done subscribing to ${fileId}`);
    // console.log(JSON.stringify(statesRef.current));
    if (statesRef.current[fileId]) return statesRef.current[fileId];
  };

  const unsubscribe = async (fileId) => {
    // console.log(`unsubscribing to ${fileId}`);
    await statesRef.current[fileId].hasLoadedPromise;
    statesRef.current[fileId].count--;
    if (statesRef.current[fileId].count === 0) {
      const content = statesRef.current[fileId].getState().doc.toString();
      // console.log(`editor ${fileId} content`);
      // console.log(content);
      await writeFileToStorage(
        getEntityData(fileId, entityTypes.file, undefined, content),
      );

      // delete only if no new subscriptions happend in the interim
      if (statesRef.current[fileId].count === 0) {
        delete statesRef.current[fileId];
      }
    }

    // console.log(`done unsubscribing to ${fileId}`);
    // console.log(JSON.stringify(statesRef.current));
  };

  const openEditorStatesInterface = {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  };

  return [statesRef.current, openEditorStatesInterface];
};

export default useOpenEditorStates;
