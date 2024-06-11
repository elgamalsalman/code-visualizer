import React from "react";
import { useDispatch, useSelector } from "react-redux";

import FileTreeEntity from "./FileTreeEntity";

function FileTree() {
  const files = useSelector((state) => state.files);

  return <div>FileTree</div>;
}

export default FileTree;
