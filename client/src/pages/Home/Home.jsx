import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import commonPageStyles from "../pages.module.css";
import styles from "./Home.module.css";

import config from "src/config";

import NavBar from "src/containers/NavBar/NavBar";
import MotoGraph from "src/components/MotoGraph/MotoGraph";

function Home() {
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
                {config.home.dataStructuresPresented.map((ds) => (
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
            divClassName={styles["moto-graph-div"]}
            offsetFactors={{
              x: 6.75 / 12,
              y: 1.75 / 12,
            }}
            dimensionFactors={{
              x: 3 / 12,
              y: 2 / 3,
            }}
          />
        </div>
        <div className={styles["footnote"]}>* coming soon</div>
      </div>
    </div>
  );
}

export default Home;
