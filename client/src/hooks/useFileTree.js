import { useEffect } from "react";
import { useImmer } from "use-immer";

import config from "src/config";
import { appStatuses } from "src/models/app/appModels";
import {
  entityTypes,
  getEntityData,
  getFileTreeNode,
} from "src/models/entity/entityModels";

import api from "src/api/api";
import { useAppStatusContext } from "./useAppStatusContext";
import { writeFileToStorage } from "src/services/storageService";

const useFileTree = () => {
  const [fileTree, updateFileTree] = useImmer(null);
  const [appStatus, setAppStatus] = useAppStatusContext();

  // pull file tree from server
  useEffect(() => {
    (async () => {
      try {
        const serverFileTree = await api.entities.pullFileTree();
        updateFileTree((fileTree) => serverFileTree);
        setAppStatus(appStatuses.idle);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const getNodeWithPath = (tree, path) => {
    const pathEntities = path.split("/").filter((e) => e !== "");

    let node = tree;
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

  const createEntity = (entityMeta) => {
    const { path, type } = entityMeta;

    const pathEntities = path.split("/");
    const parentPath = pathEntities.slice(0, -1).join("/");
    const entityName = pathEntities[pathEntities.length - 1];

    const parent = getNodeWithPath(fileTree, parentPath);
    if (parent.children.find((e) => e.name === entityName) === undefined) {
      updateFileTree((tree) => {
        const parent = getNodeWithPath(tree, parentPath);
        parent.children.push(getFileTreeNode(entityName, type));
      });

      // if file, empty previous entries in localstorage
      if (type === entityTypes.file) {
        writeFileToStorage(getEntityData(path, type, undefined, ""));
      }
    } else {
      console.error("creating entity that already exists!");
    }
  };

  const deleteEntity = (entityMeta) => {
    const { path, type } = entityMeta;

    const pathEntities = path.split("/");
    const parentPath = pathEntities.slice(0, -1).join("/");
    const entityName = pathEntities[pathEntities.length - 1];

    const parent = getNodeWithPath(fileTree, parentPath);
    if (parent.children.find((e) => e.name === entityName) !== undefined) {
      updateFileTree((tree) => {
        const parent = getNodeWithPath(tree, parentPath);
        parent.children = parent.children.filter(
          (child, index) => child.name !== entityName,
        );
      });
    } else {
      console.error("deleting an entity that doesn't exist!");
    }
  };

  const fileTreeInterface = {
    createEntity: createEntity,
    deleteEntity: deleteEntity,
  };

  return [fileTree, fileTreeInterface];
};

export default useFileTree;
