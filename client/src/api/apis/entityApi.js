import config from "src/config";

import { methods, query } from "../utils";

const pushEvents = async (userId, entityEvents) => {
  return await query(methods.put, "/entities/push", { events: entityEvents });
};

const pullFileTree = async () => {
  const file_tree = await query(methods.post, "/entities/pull/file-tree");
  console.log("server file tree:", file_tree);
  return file_tree;
};

const pullEntities = async (userId, entityMetas) => {
  const entities = await query(methods.post, "/entities/pull/entities", {
    entity_metas: entityMetas,
  });
  console.log("server entities:", entities);
  return entities;
};

const entityApi = {
  pushEvents,
  pullFileTree,
  pullEntities,
};

export default entityApi;
