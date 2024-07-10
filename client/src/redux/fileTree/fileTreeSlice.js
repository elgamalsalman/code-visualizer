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
      // action.payload: entityEvent: { type, entity }
      const {
        type: eventType,
        entity: {
          meta: { path, type },
        },
      } = action.payload;

      const getNode = (path) => {
        const pathEntities = path.split("/").filter((e) => e !== "");

        let node = state;
        for (const pathEntityName of pathEntities) {
          let found = false;
          for (const child of node.children) {
            if (child.name === pathEntityName) {
              node = child;
              found = true;
              break;
            }
          }

          if (!found) {
            const error = `parent entity path of ${path} doesn't exist`;
            console.error(error);
            throw error;
          }
        }

        return node;
      };

      if (eventType === entityEventTypes.create) {
        const pathEntities = path.split("/");
        const parentPath = pathEntities.slice(0, -1).join("/");
        const entityName = pathEntities[pathEntities.length - 1];

        let parent = getNode(parentPath);

        if (
          parent.children.find((element) => element.name === entityName) ===
          undefined
        ) {
          parent.children.push(getFileTreeNode(entityName, type));
        } else {
          console.error("creating entity that already exists!");
        }
      } else if (eventType === entityEventTypes.delete) {
        const pathEntities = path.split("/");
        const parentPath = pathEntities.slice(0, -1).join("/");
        const entityName = pathEntities[pathEntities.length - 1];

        let parent = getNode(parentPath);

        parent.children = parent.children.filter(
          (child, index) => child.name !== entityName,
        );
      }
    },
  },
});

export const { updateFileTree, updateEntity } = fileTreeSlice.actions;
export default fileTreeSlice.reducer;
