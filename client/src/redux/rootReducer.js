import { combineReducers } from "@reduxjs/toolkit";
import runsReducer from "./runs/runsSlice";

const rootReducer = combineReducers({
  runs: runsReducer,
});

export default rootReducer;
