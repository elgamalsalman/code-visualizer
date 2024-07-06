import { createSlice } from "@reduxjs/toolkit";
import { getFileTreeNode } from "src/models/entity/entityModels";
import { entityEventTypes } from "src/models/events/entityEvents";

const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState: null,
  reducers: {
    updateFileTree: (state, action) => {
      // action.payload: { fileTree }
      const { fileTree } = action.payload;
      console.log(fileTree);
      return fileTree;
    },
    updateEntity: (state, action) => {
      // TODO: action.payload: entityEvent: { type, entity }
      const {
        type: eventType,
        entity: {
          meta: { path, type },
        },
      } = action.payload;

      if (eventType === entityEventTypes.create) {
        console.log(`Creating a new entity!`);
        console.log(action);

        const pathEntities = path.split("/");
        const parentPathEntities = pathEntities.slice(0, -1);
        const entityName = pathEntities[pathEntities.length - 1];

        let node = state;
        for (const pathEntityName of parentPathEntities) {
          let found = false;
          for (const child of node.children) {
            if (child.name === pathEntityName) {
              node = child;
              found = true;
              break;
            }
          }

          if (!found) {
            console.error(
              `updateEntity dispatched with an invalid entity path of ${path}`,
            );
            return state;
          }
        }

        if (
          node.children.find((element) => element.name === entityName) ===
          undefined
        ) {
          node.children.push(getFileTreeNode(entityName, type));
        } else {
          console.error("creating entity that already exists!");
        }
      }
    },
  },
});

export const { updateFileTree, updateEntity } = fileTreeSlice.actions;
export default fileTreeSlice.reducer;
