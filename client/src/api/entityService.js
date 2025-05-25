import config from "src/config";

import {
  getPushEntityEventsRequest,
  getPullServerFileTreeRequest,
  getPullServerEntitiesRequest,
} from "./entityRequests";

const pushEntityEventsToServer = async (userId, entityEvents) => {
  const requestOptions = {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getPushEntityEventsRequest(userId, entityEvents)),
  };
  const requestURL = `${config.server.api.url}/push`;
  const response = await fetch(requestURL, requestOptions);
  const data = await response.json();
  console.log(data);
};

const pullServerFileTree = async () => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getPullServerFileTreeRequest()),
  };
  const requestURL = `${config.server.api.url}/pull/file_tree`;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log("pulled server file tree payload:");
  console.log(payload);

  if (!response.ok) throw payload;

  return payload.file_tree;
};

const pullServerEntities = async (userId, entityMetas) => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getPullServerEntitiesRequest(userId, entityMetas)),
  };
  const requestURL = `${config.server.api.url}/pull/entities`;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();
  console.log("pulled server entities payload:");
  console.log(payload);
  if (payload.status === config.server.http_codes.failed) {
    throw new Error(payload.error);
  }
  return payload.entities;
};

export { pushEntityEventsToServer, pullServerFileTree, pullServerEntities };
