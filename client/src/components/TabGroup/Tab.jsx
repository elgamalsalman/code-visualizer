import React, { useId } from "react";
import styles from "./Tab.module.css";

const Tab = ({ id /* DO NOT REMOVE */, children, className }) => {
  // tab id is a placeholder to be used by the tab group
  return (
    <div className={`${styles["tab"]} ${className && className}`}>
      {children}
    </div>
  );
};

export default Tab;
