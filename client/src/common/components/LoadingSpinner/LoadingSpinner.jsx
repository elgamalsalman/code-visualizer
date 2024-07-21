import React from "react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({ className, isSpinning }) => {
  return (
    <div
      className={`${
        isSpinning
          ? styles["loading-spinner-on"]
          : styles["loading-spinner-off"]
      } ${className ? className : ""}`}
    ></div>
  );
};
export default LoadingSpinner;
