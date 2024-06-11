import { createSlice } from "@reduxjs/toolkit";

import { runDoneStatuses, getNewRun } from "src/models/run/runModels";

const runsSlice = createSlice({
  name: "runs",
  initialState: [],
  reducers: {
    createRun: (state, action) => {
      // action.payload: { startTime }
      const { startTime } = action.payload;
      if (state.length > 0) {
        const run = state[state.length - 1];
        if (runDoneStatuses.includes(run.status)) {
          throw Error("creating run when prev is not done");
        }
      }

      const id = state.length;
      const newRun = getNewRun(id, startTime);
      state.push(newRun);
    },
    logRunEvent: (state, action) => {
      // action.payload: { event }
      if (state.length <= 0) {
        throw Error("Received run event without any runs created!");
      }

      const { event } = action.payload;
      const run = state[state.length - 1];
      if (runDoneStatuses.includes(run.status))
        throw Error("logging to a done run!");
      const dataLength = run.data.length;
      if (dataLength > 0 && run.data[dataLength - 1].type === event.type) {
        run.data[dataLength - 1] += event.data;
      } else {
        run.data.push(event);
      }
    },
    terminateRun: (state, action) => {
      // action.payload: { event, endTime }
      if (state.length <= 0) {
        throw Error("Received run event without any runs created!");
      }
      if (!runDoneStatuses.includes(action.event.status)) {
        throw Error(
          "Received a termination event with an unrecognised terminations status",
        );
      }

      const { event, endTime } = action.payload;
      const run = state[state.length - 1];
      if (runDoneStatuses.includes(run.status))
        throw Error("terminating a done run!");
      run.data.push(event);
      run.status = event.status;
      run.endTime = endTime;
    },
  },
});

export const { createRun, logRunEvent, terminateRun } = runsSlice.actions;
export default runsSlice.reducer;
