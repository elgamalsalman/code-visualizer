import React from "react";
import styles from "./Tile.module.css";

const Tile = ({ children }) => {
  return <div className={styles["tile"]}>{children}</div>;
};

export default Tile;
