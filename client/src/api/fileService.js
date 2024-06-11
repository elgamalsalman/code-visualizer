import config from "src/config";

import {
  getPullServerEntitiesRequest,
  getUpdateServerEntitiesRequest,
} from "./fileModels";

const updateServerEntities = async (userId, entities) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getUpdateServerEntitiesRequest(userId, entities)),
  };
  const requestURL = `${config.server.api.url}/save`;
  const response = await fetch(requestURL, requestOptions);
  const data = await response.json();
  console.log(data);
};

const pullServerFileTree = async (userId, readContents) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getPullServerEntitiesRequest(userId)),
  };
  const requestURL = `${config.server.api.url}/pull`;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();
  console.log("pulled server entities response:");
  console.log(response);
  if (payload.status === config.server.http_codes.failed) {
    throw new Error(payload.error);
  }
  return payload.file_tree;
};

export { updateServerEntities, pullServerFileTree };