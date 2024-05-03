import React from "react";
import styles from "./TabHead.module.css";

import {
  XMarkIcon,
  CodeBracketIcon,
  CommandLineIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const get_type_icon = (type) => {
  const icon_classes = "w-4 h-4";
  if (type === "code") {
    return <CodeBracketIcon className={icon_classes} />;
  } else if (type === "console") {
    return <CommandLineIcon className={icon_classes} />;
  } else if (type === "grapher") {
    return <ShareIcon className={icon_classes} />;
  } else {
    return null;
  }
};

const TabHead = ({ title, type, isActive, onClick, onClose }) => {
  const icon = get_type_icon(type);

  return (
    <div
      className={`${styles["tab-head"]} ${isActive ? styles["active-tab-head"] : ""}`}
    >
      <div onClick={onClick} className={styles["tab-head-title-box"]}>
        {icon}
        <span className="tab-head-title">{title}</span>
      </div>
      <button onClick={onClose} className="">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TabHead;
