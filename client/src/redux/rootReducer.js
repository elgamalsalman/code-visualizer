import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import filesReducer from "./files/filesSlice";
import runsReducer from "./runs/runsSlice";

const rootReducer = combineReducers({
  app: appReducer,
  files: filesReducer,
  runs: runsReducer,
});

export default rootReducer;
