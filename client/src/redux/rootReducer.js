import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import fileTreeReducer from "./fileTree/fileTreeSlice";
import runsReducer from "./runs/runsSlice";

const rootReducer = combineReducers({
  app: appReducer,
  fileTree: fileTreeReducer,
  runs: runsReducer,
});

export default rootReducer;
