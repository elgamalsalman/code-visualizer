import React from "react";
import styles from "./DirContextMenu.module.css";

import { TrashIcon } from "@heroicons/react/24/outline";

import ContextMenu from "src/components/ContextMenu/ContextMenu";

function DirContextMenu({ isActive, position, onBlur, onDelete }) {
  const items = [
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

export default DirContextMenu;
