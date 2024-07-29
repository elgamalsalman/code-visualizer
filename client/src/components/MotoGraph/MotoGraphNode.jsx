import React, { useState } from "react";
import styles from "./MotoGraphNode.module.css";
import { Handle } from "@xyflow/react";
import clsx from "clsx";

function MotoGraphNode({ data }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={styles["node"]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!data.noTargetHandle && <Handle type="target" position="top" />}
      <div className={styles["label"]}>"{data.label}"</div>
      {!data.noSourceHandle && <Handle type="source" position="bottom" />}
      <div className={styles["description-wrapper"]}>
        <div
          className={clsx(
            styles["description"],
            hover &&
              !data.isBeingDragged &&
              !data.isActive &&
              styles["description-visible"],
          )}
        >
          <div className={styles["line"]}>
            <span className={styles["text-class"]}>Node</span>
            {" {"}
          </div>
          <div className={styles["indentation"]}>
            <div className={styles["line"]}>
              <span className={styles["text-prop"]}>address</span>
              {": "}
              <span
                className={
                  ["nullptr", "NULL"].includes(data.description.address)
                    ? styles["text-special-values"]
                    : styles["text-address"]
                }
              >
                {data.description.address}
              </span>
              {","}
            </div>
            <div className={styles["line"]}>
              <span className={styles["text-prop"]}>value</span>
              {": "}
              <span className={styles["text-string"]}>
                {data.description.value}
              </span>
              {","}
            </div>
            <div className={styles["line"]}>
              <span className={styles["text-prop"]}>next</span>
              {": "}
              <span
                className={
                  ["nullptr", "NULL"].includes(data.description.next)
                    ? styles["text-special-values"]
                    : styles["text-address"]
                }
              >
                {data.description.next}
              </span>
              {","}
            </div>
          </div>
          <div className={styles["line"]}>
            <span>{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotoGraphNode;
