import { combineReducers } from "@reduxjs/toolkit";
import fileTreeReducer from "./fileTree/fileTreeSlice";
import runsReducer from "./runs/runsSlice";

const rootReducer = combineReducers({
  fileTree: fileTreeReducer,
  runs: runsReducer,
});

export default rootReducer;
