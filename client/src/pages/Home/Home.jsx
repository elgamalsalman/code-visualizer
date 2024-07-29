import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import commonPageStyles from "../pages.module.css";
import styles from "./Home.module.css";

import NavBar from "src/containers/NavBar/NavBar";
import MotoGraph from "src/components/MotoGraph/MotoGraph";

const dataStructuresPresented = [
  { name: "Linked-lists", isAvailable: true },
  { name: "Trees", isAvailable: true },
  { name: "Vectors", isAvailable: false },
  { name: "Graphs", isAvailable: false },
];

function Home() {
  const [motoGraphDivDimensions, setMotoGraphDivDimensions] = useState({
    x: 1525,
    y: 667,
  });
  useEffect(() => {
    const motoGraphDiv = document.getElementsByClassName(
      styles["moto-graph-div"],
    )[0];
    const observer = new ResizeObserver(() => {
      setMotoGraphDivDimensions({
        x: motoGraphDiv.offsetWidth,
        y: motoGraphDiv.offsetHeight,
      });
    });
    observer.observe(motoGraphDiv);

    return () => {
      observer.disconnect();
    };
  }, []);

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
          <MotoGraph
            className={styles["moto-graph"]}
            offset={{
              x: motoGraphDivDimensions.x * (7 / 12),
              y: motoGraphDivDimensions.y * (1 / 6),
            }}
            dimensions={{
              x: motoGraphDivDimensions.x * (3 / 12),
              y: motoGraphDivDimensions.y * (2 / 3),
            }}
          />
        </div>
        <div className={styles["footnote"]}>* coming soon</div>
      </div>
    </div>
  );
}

export default Home;
