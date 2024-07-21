import config from "src/config";

import HeaderableWebSocket from "src/common/utils/HeaderableWebSocket";

const createRunWS = () => {
  const header = { user_id: config.userId };
  const url = `${config.server.api.ws.url}/run`;
  return new HeaderableWebSocket(url, header);
};

export { createRunWS };
