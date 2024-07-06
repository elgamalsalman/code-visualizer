import React, { useRef, useEffect } from "react";
import styles from "./ContextMenu.module.css";

function ContextMenu({ isActive, position, onBlur, items }) {
  const contextMenuRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (
        contextMenuRef.current &&
        (e.clientX !== position.x || e.clientY !== position.y) &&
        !contextMenuRef.current.contains(e.target)
      ) {
        onBlur();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onBlur();
      }
    };

    if (isActive && onBlur) {
      document.addEventListener("click", handleClick);
      document.addEventListener("contextmenu", handleClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const itemMapper = (item) => {
    if (item.type === "button") {
      return (
        <div className={styles["button"]} onClick={item.onClick}>
          <div className={styles["icon-div"]}>{item.icon}</div>
          <div className={styles["text"]}>{item.text}</div>
        </div>
      );
    }
  };

  return (
    <div
      ref={contextMenuRef}
      className={`${styles["context-menu"]} ${isActive ? styles["active-context-menu"] : ""}`}
      style={{ left: position.x, top: position.y }}
    >
      {items
        .map((section, sectionIndex) => {
          return section.map((item, itemIndex) => {
            return (
              <div
                key={`${sectionIndex}-${itemIndex}`}
                className={styles["context-menu-item"]}
              >
                {itemMapper(item)}
              </div>
            );
          });
        })
        .reduce((arr, items, index) => {
          if (arr.length === 0) return items;
          else {
            return [
              ...arr,
              <div
                key={`separator-${index}`}
                className={styles["item-separator"]}
              ></div>,
              ...items,
            ];
          }
        }, [])}
    </div>
  );
}

export default ContextMenu;
