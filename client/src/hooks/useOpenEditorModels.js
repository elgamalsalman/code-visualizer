import { useRef } from "react";

const useOpenEditorModels = () => {
  const modelsRef = useRef({ "main.cpp": {}, "headers/vector.h": {} }); // FIXME: {}
  const subscribe = (fileId) => {}; // TODO
  const unsubscribe = (fileId) => {}; // TODO
  return [modelsRef, subscribe, unsubscribe];
};

export default useOpenEditorModels;
