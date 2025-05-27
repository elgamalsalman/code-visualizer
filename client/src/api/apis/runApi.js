import { connect } from "../utils";

const run = () => {
  return connect("/runs/run");
};

const runApi = { run };

export default runApi;
