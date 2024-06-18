import React from "react";
import styles from "./Tile.module.css";

const Tile = ({ className, children, transparent }) => {
  const classes = [styles["tile"]];
  if (transparent) classes.push(styles["transparent-tile"]);
  if (className) classes.push(className);
  const class_string = classes.reduce((prev, cls) => {
    return `${prev} ${cls}`;
  }, "");
  return <div className={class_string}>{children}</div>;
};

export default Tile;
