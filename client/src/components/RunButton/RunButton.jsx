import React from "react";
import "./RunButton.css";

import { PlayIcon } from "@heroicons/react/24/outline";

const RunButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className=".run-button"
    >
      <PlayIcon className=".run-button-icon" aria-hidden="true" />
      <span>Run</span>
    </button>
  );
};

export default RunButton;