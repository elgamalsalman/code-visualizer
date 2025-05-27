import config from "src/config";

import { enumerate } from "src/common/utils/constantUtils";

const methods = enumerate(["GET", "POST", "PUT", "UPDATE", "DELETE"]);

const query = async (
  method,
  queryPath,
  body = null,
  params = null,
  options = null,
) => {
  if (!methods.includes(method)) throw Error("invalid http method");

  const requestOptions = {
    method: method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === null ? null : JSON.stringify(body),
    ...options,
  };

  const requestPath = `${config.api.url}${queryPath}`;
  const requestUrl =
    requestPath + (params ? `?${new URLSearchParams(params).toString()}` : "");
  const response = await fetch(requestUrl, requestOptions);
  const data = await response.json();

  if (!response.ok) throw data;
  return data;
};

const connect = (queryPath) => {
  const url = `${config.api.url}${queryPath}`;
  return new WebSocket(url);
};

export { methods, query, connect };
