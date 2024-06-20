import React from "react";
import styles from "./Tab.module.css";

const Tab = ({ children, className }) => {
  return (
    <div className={`${styles["tab"]} ${className && className}`}>
      {children}
    </div>
  );
};

export default Tab;
