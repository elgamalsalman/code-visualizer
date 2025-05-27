import authApi from "./apis/authApi";
import entityApi from "./apis/entityApi";
import userApi from "./apis/userApi";
import runApi from "./apis/runApi";

const api = {
  auth: authApi,
  entities: entityApi,
  users: userApi,
  runs: runApi,
};

export default api;
