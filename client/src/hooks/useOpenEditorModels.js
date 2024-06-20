import { useRef } from "react";

import * as monaco from "monaco-editor";

const useOpenEditorModels = () => {
  const modelsRef = useRef({
    "main.cpp": {
      count: 1,
      current: monaco.editor.createModel("new main model!", "cpp"),
      monaco,
    },
    "headers/vector.h": {
      count: 1,
      current: monaco.editor.createModel("new vector model!", "cpp"),
      monaco,
    },
  }); // FIXME: {}
  const subscribe = (fileId) => {}; // TODO
  const unsubscribe = (fileId) => {}; // TODO
  return [modelsRef, subscribe, unsubscribe];
};

export default useOpenEditorModels;
