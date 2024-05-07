import React, { useState } from "react";
import styles from "./TabGroup.module.css";

import { PlusIcon } from "@heroicons/react/24/solid";

import TabHead from "components/TabGroup/TabHead";

const onTabClose = () => {
  // TODO
};

const TabGroup = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // assert that the children are tabs
  tabs.forEach((child) => {
    if (child.type.name !== "Tab") {
      console.error("TabGroup's tabs are not all Tab components");
    }
  });

  // active tab management
  const activeTabTitle = tabs[activeTabIndex]?.props.title;
  const getActiveTabHandler = (tabIndex) => {
    return () => {
      setActiveTabIndex(tabIndex);
    };
  };

  // get list of tab heads
  let i = -1;
  const tabGroupHeads = tabs.map((child) => {
    i++;
    const { title, type } = child.props;
    return (
      <TabHead
        key={title}
        title={title}
        type={type}
        isActive={title === activeTabTitle}
        onClick={getActiveTabHandler(i)}
        onClose={onTabClose}
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
      <div className={styles["tab-body"]}>{tabs}</div>
    </div>
  );
};

export default TabGroup;
