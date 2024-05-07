import React from "react";
import styles from "./TabHead.module.css";

import {
  XMarkIcon,
  CodeBracketIcon,
  CommandLineIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";

const get_type_icon = (type, icon_classes) => {
  if (type === "code") {
    const code_icon_color = "#3b82f6";
    return <CodeBracketIcon className={icon_classes} color={code_icon_color} />;
  } else if (type === "console") {
    const console_icon_color = "#a3a3a3";
    return (
      <CommandLineIcon className={icon_classes} color={console_icon_color} />
    );
  } else if (type === "grapher") {
    const grapher_icon_color = "#e5e5e5";
    return <ShareIcon className={icon_classes} color={grapher_icon_color} />;
  } else {
    return null;
  }
};

const TabHead = ({ title, type, isActive, onClick, onClose }) => {
  return (
    <div
      className={`${styles["tab-head"]} ${isActive ? styles["active-tab-head"] : ""}`}
    >
      <div onClick={onClick} className={styles["tab-head-title-div"]}>
        {get_type_icon(type, styles["tab-head-title-icon"])}
        <span className="tab-head-title">{title}</span>
      </div>
      <button onClick={onClose} className={styles["tab-head-close-button"]}>
        <XMarkIcon className={styles["tab-head-close-button-icon"]} />
      </button>
    </div>
  );
};

export default TabHead;
