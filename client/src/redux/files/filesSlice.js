import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: {},
  reducers: {
    updateFileTree: (state, action) => {
      // action.payload: { fileTree }
      const { fileTree } = action.payload;
      return fileTree;
    },
    updateFile: (state, action) => {
      // TODO: action.payload: { entity }
      // const { entity } = action.payload;
      // state[entity.path] = entity;
    },
  },
});

export const { updateFileTree, updateFile } = filesSlice.actions;
export default filesSlice.reducer;
