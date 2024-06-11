import { createSlice } from "@reduxjs/toolkit";

import { appStatuses } from "src/models/app/appModels";

const appSlice = createSlice({
  name: "app",
  initialState: {
    status: appStatuses.pending,
  },
  reducers: {
    setAppStatus: (state, action) => {
      // action.payload: { status }
      const { status } = action.payload;
      state.status = status;
    },
  },
});

export const { setAppStatus } = appSlice.actions;
export default appSlice.reducer;
