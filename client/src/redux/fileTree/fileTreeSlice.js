import { createSlice } from "@reduxjs/toolkit";

const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState: null,
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

export const { updateFileTree, updateFile } = fileTreeSlice.actions;
export default fileTreeSlice.reducer;
