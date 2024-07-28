import React from "react";
import clsx from "clsx";
import commonPageStyles from "../pages.module.css";
import styles from "./Home.module.css";

import NavBar from "src/containers/NavBar/NavBar";
import { ReactComponent as MotoGraphWide } from "src/assets/moto_graph_wide.svg";

function Home() {
  const dataStructuresPresented = [
    { name: "Linked-lists", isAvailable: true },
    { name: "Trees", isAvailable: true },
    { name: "Vectors", isAvailable: false },
    { name: "Graphs", isAvailable: false },
  ];
  return (
    <div
      className={clsx(
        commonPageStyles["page-dark-background"],
        styles["home-page"],
      )}
    >
      <NavBar />
      <div className={styles["content"]}>
        <div className={styles["main-text-div"]}>
          <div>DSA:</div>
          <div className={styles["data-structures-line"]}>
            <div className={styles["data-structures-line-marker"]}>{"> "}</div>
            <div className={styles["data-structures-list-div"]}>
              <div className={styles["data-structures-list"]}>
                {dataStructuresPresented.map((ds) => (
                  <div
                    key={ds.name}
                    className={clsx(
                      styles["data-structure"],
                      !ds.isAvailable && styles["data-structure-coming-soon"],
                    )}
                  >
                    {ds.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            Made <span className={styles["emphasized-text"]}>Visual!</span>
          </div>
        </div>
        <div className={styles["moto-graph-div"]}>
          <div className={styles["graph-top-padding"]}></div>
          <div className={styles["moto-graph-items"]}>
            <MotoGraphWide className={styles["moto-graph"]} />
            <div
              className={clsx(
                styles["node-overlay"],
                styles["code-node-overlay"],
              )}
            ></div>
            <div
              className={clsx(
                styles["node-overlay"],
                styles["visualize-node-overlay"],
              )}
            ></div>
            <div
              className={clsx(
                styles["node-overlay"],
                styles["interact-node-overlay"],
              )}
            ></div>
          </div>
          <div className={styles["graph-bottom-padding"]}></div>
        </div>
        <div className={styles["footnote"]}>* coming soon</div>
      </div>
    </div>
  );
}

export default Home;
