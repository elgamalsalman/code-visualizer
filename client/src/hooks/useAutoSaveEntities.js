import config from "src/config";

import { entityTypes, getEntityData } from "src/models/entity/entityModels";
import { entityEventTypes } from "src/models/events/entityEvents";

import useAutoSave from "src/common/hooks/useAutoSave";
import { pushEntityEventsToServer } from "src/api/entityService";
import {
  readFileFromLocalStorage,
  writeFileToLocalStorage,
} from "src/services/localStorageService";

const useAutoSaveEntities = (editorModelRefs) => {
  return useAutoSave(async (changes) => {
    const locallyProcessedEntityEvents = await Promise.all(
      changes.map(async (entityEvent) => {
        if (
          [entityEventTypes.create, entityEventTypes.write].includes(
            entityEvent.type,
          ) &&
          entityEvent.entity.type === entityTypes.file
        ) {
          let fileContent = null;
          const model = editorModelRefs[entityEvent.entity.path].current;
          if (model) {
            fileContent = model.getValue();
          } else {
            // if editor no longer exists take info from localstorage
            fileContent = await readFileFromLocalStorage(entityEvent.entity);
          }
          const entity = getEntityData(
            entityEvent.entity.path,
            entityTypes.file,
            undefined,
            fileContent,
          );
          await writeFileToLocalStorage(entity);
          entityEvent.entity = entity;
        }

        return entityEvent;
      }),
    );
    await pushEntityEventsToServer(config.userId, locallyProcessedEntityEvents);
    console.log("saved to server!");
  }, config.autoSavingDelay);
};

export default useAutoSaveEntities;
