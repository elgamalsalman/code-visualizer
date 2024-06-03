import { createSlice } from "@reduxjs/toolkit";

import { runDoneStatuses, getNewRun } from "src/models/runs/runsModels";

const runsSlice = createSlice({
  name: "runs",
  initialState: [],
  reducers: {
    createRun: (state, action) => {
      // action: { startTime }
      if (state.length > 0) {
        const run = state[state.length - 1];
        if (runDoneStatuses.includes(run.status)) {
          throw Error("creating run when prev is not done");
        }
      }

      const id = state.length;
      const newRun = getNewRun(id, action.startTime);
      state.runs.push(newRun);
    },
    logRunEvent: (state, action) => {
      // action: { event }
      if (state.length <= 0) {
        throw Error("Received run event without any runs created!");
      }

      const run = state[state.length - 1];
      if (runDoneStatuses.includes(run.status))
        throw Error("logging to a done run!");
      const dataLength = run.data.length;
      if (
        dataLength > 0 &&
        run.data[dataLength - 1].type === action.event.type
      ) {
        run.data[dataLength - 1] += action.event.data;
      } else {
        run.data.push(action.event);
      }
    },
    terminateRun: (state, action) => {
      // action: { event, endTime }
      if (state.length <= 0) {
        throw Error("Received run event without any runs created!");
      }
      if (!runDoneStatuses.includes(action.event.status)) {
        throw Error(
          "Received a termination event with an unrecognised terminations status",
        );
      }

      const run = state[state.length - 1];
      if (runDoneStatuses.includes(run.status))
        throw Error("terminating a done run!");
      run.data.push(action.event);
      run.status = action.event.status;
      run.endTime = action.endTime;
    },
  },
});

export const { createRun, logRunEvent, terminateRun } = runsSlice.actions;
export default runsSlice.reducer;
