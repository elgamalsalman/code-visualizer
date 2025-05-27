import { methods, query } from "../utils";

const get = async (userId, entityEvents) => {
  return await query(methods.get, "/users/get");
};

const userApi = { get };

export default userApi;
