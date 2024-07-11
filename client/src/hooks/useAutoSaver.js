import config from "src/config";

import { entityTypes, getEntityData } from "src/models/entity/entityModels";
import { entityEventTypes } from "src/models/events/entityEvents";

import useBasicAutoSaver from "src/common/hooks/useBasicAutoSaver";
import { pushEntityEventsToServer } from "src/api/entityService";
import {
  readFileFromStorage,
  writeFileToStorage,
} from "src/services/storageService";

const useAutoSaver = (editorStates) => {
  const basicAutoSaverInterface = useBasicAutoSaver(async (changes) => {
    const locallyProcessedEntityEvents = await Promise.all(
      changes.map(async (entityEvent) => {
        if (
          [entityEventTypes.create, entityEventTypes.write].includes(
            entityEvent.type,
          ) &&
          entityEvent.entity.type === entityTypes.file
        ) {
          let fileContent = null;
          const state = editorStates[entityEvent.entity.path];
          if (state) {
            fileContent = state.getState().doc.toString();
          } else {
            // if editor no longer exists take info from storage
            fileContent = await readFileFromStorage(entityEvent.entity);
          }
          if (fileContent === null) fileContent = ""; // if file just created
          const entity = getEntityData(
            entityEvent.entity.path,
            entityTypes.file,
            undefined,
            fileContent,
          );
          await writeFileToStorage(entity);
          entityEvent.entity = entity;
        }

        return entityEvent;
      }),
    );
    await pushEntityEventsToServer(config.userId, locallyProcessedEntityEvents);
    console.log("saved to server!");
  }, config.autoSavingDelay);

  return {
    save: basicAutoSaverInterface.save,
    registerChangeEvent: basicAutoSaverInterface.registerChangeEvent,
  };
};

export default useAutoSaver;
