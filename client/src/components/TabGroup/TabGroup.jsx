import React, { useState, useRef } from "react";
import styles from "./TabGroup.module.css";

import { PlusIcon } from "@heroicons/react/24/solid";

import TabHead from "src/components/TabGroup/TabHead";

const TabGroup = ({ tabs, activeTabId, onActiveTabChange, onTabClose }) => {
  // get list of tab heads
  const tabGroupHeads = tabs.map((child) => {
    const { id, title, type } = child.props;
    return (
      <TabHead
        key={id}
        title={title}
        type={type}
        isActive={id === activeTabId}
        onClick={() => onActiveTabChange(id)}
        onClose={() => onTabClose(id)}
      />
    );
  });

  return (
    <div className={styles["tab-group"]}>
      <div className={styles["tab-group-header"]}>
        <div className={styles["tab-heads-div"]}>{tabGroupHeads}</div>
        <div className={styles["controls-panel"]}>
          <button
            className={styles["new-tab-button"]}
            onClick={() => {
              console.log("creating new tab!");
            }}
          >
            <PlusIcon className={styles["new-tab-button-icon"]} />
          </button>
        </div>
      </div>
      <div className={styles["tab-group-body"]}>
        {tabs.map((tab) => {
          return (
            <div
              key={tab.props.id}
              className={`${styles["tab-wrapper"]} ${tab.props.id === activeTabId && styles["active-tab-wrapper"]}`}
            >
              {tab}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabGroup;
