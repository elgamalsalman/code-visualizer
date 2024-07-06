import React from "react";
import styles from "./FileContextMenu.module.css";

import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

import ContextMenu from "src/components/ContextMenu/ContextMenu";

function FileContextMenu({ isActive, position, onBlur, onOpen, onDelete }) {
  const items = [
    [
      {
        type: "button",
        icon: <EyeIcon />,
        text: "Open",
        onClick: onOpen,
      },
    ],
    [
      {
        type: "button",
        icon: <TrashIcon className={styles["delete-icon"]} />,
        text: "Delete",
        onClick: onDelete,
      },
    ],
  ];

  return (
    <ContextMenu
      isActive={isActive}
      position={position}
      onBlur={onBlur}
      items={items}
    />
  );
}

export default FileContextMenu;
