import { useEffect, useReducer, useRef, useState } from "react";
import { useImmer, useImmerReducer } from "use-immer";

import { entityTypes, getEntityMeta } from "src/models/entity/entityModels";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";
import { generateId } from "src/common/utils/securityUtils";

import WindowSplit from "src/common/components/WindowSplit/WindowSplit";
import Tile from "src/common/components/Tile/Tile";
import TabGroup from "src/components/TabGroup/TabGroup";
import Tab from "src/components/TabGroup/Tab";
import Editor from "src/containers/Editor/Editor";
import Console from "src/containers/Console/Console";
import Grapher from "src/containers/Grapher/Grapher";

const addIds = (initialTree) => {
  const recursiveIdHandler = (tree) => {
    tree.id = generateId();
    if (tree.type === "split") {
      for (const window of tree.windows) recursiveIdHandler(window);
    } else if (tree.type === "tabGroup") {
      for (const tab of tree.tabs) tab.id = generateId();
      tree.activeTabId = tree.tabs[0].id;
    } else console.error("invalid window tree initialization");
  };
  recursiveIdHandler(initialTree);
  return initialTree;
};

// No need to initialise ids and activeTabIds, will be done automatically
const initialWindowTree = addIds({
  type: "split",
  direction: "horizontal",
  windows: [
    {
      type: "tabGroup",
      tabs: [{ type: "editor", path: "main.cpp" }],
    },
    {
      type: "tabGroup",
      tabs: [{ type: "grapher" }, { type: "console" }],
    },
  ],
});

const useWindowTree = (
  runs,
  openEditorStatesInterface,
  autoSaverInterface,
  runsInterface,
) => {
  const [windowTree, updateWindowTree] = useImmer(initialWindowTree);

  const dfs = (windowComparator, windowUpdate, processAll = false) => {
    const recursiveDfs = (currWindowTree, parentWindowUpdate) => {
      let res = false;
      if (currWindowTree.type === "split") {
        let i = 0;
        const subWindowUpdates = {};
        for (const subWindowTree of currWindowTree.windows) {
          let currI = i;
          if (
            recursiveDfs(subWindowTree, (currSubWindowUpdates) => {
              subWindowUpdates[currI] = currSubWindowUpdates;
            })
          ) {
            res = true;
            // if sub dfs worked then this one worked
            if (!processAll) break;
          }
          i++;
        }

        // collate child updates into one parental update call
        parentWindowUpdate((windowTree) => {
          for (const i in subWindowUpdates) {
            subWindowUpdates[i](windowTree.windows[i]);

            // cleanup
            (() => {
              if (windowTree.windows[i].type === "tabGroup") {
                // close empty tabs
                if (windowTree.windows[i].tabs.length === 0) {
                  windowTree.windows.splice(i, 1);
                }
              } else if (windowTree.windows[i].type === "split") {
                // collapse single child splits too
                if (windowTree.windows[i].windows.length === 1) {
                  windowTree.windows[i] = windowTree.windows[i].windows[0];
                }
              }
            })();
          }
        });
      } else if (currWindowTree.type === "tabGroup") {
        // if you found the window
        if (windowComparator(currWindowTree)) {
          res = true;
          parentWindowUpdate((windowTree) => {
            windowUpdate(windowTree);
          });
        }
      }
      return res;
    };

    return recursiveDfs(windowTree, updateWindowTree);
  };

  const closeWindowTab = (windowId, id) => {
    return dfs(
      (window) => window.id === windowId,
      (window) => {
        let index = null;
        let nextActiveId = null;
        for (let i = 0; i < window.tabs.length; i++) {
          if (window.tabs[i].id === id) index = i;
          else nextActiveId = window.tabs[i].id;

          if (index !== null && nextActiveId !== null) break;
        }

        if (index !== null) {
          window.tabs.splice(index, 1);
          // if active tab is closed make another one active
          if (window.activeTabId === id) {
            window.activeTabId = nextActiveId;
          }
        } else console.error("deleting a tab id that doesn't exist");
      },
      false,
    );
  };

  const closeTabs = (tabComparator) => {
    return dfs(
      (window) => {
        for (const tab of window.tabs) if (tabComparator(tab)) return true;
        return false;
      },
      (window) => {
        let nextActiveId = null;
        let closedActiveTab = false;
        window.tabs = window.tabs.filter((tab, index) => {
          if (tabComparator(tab)) {
            if (window.activeTabId === tab.id) closedActiveTab = true;
            return false;
          } else {
            if (nextActiveId === null) nextActiveId = tab.id;
            return true;
          }
        });

        if (closedActiveTab) {
          window.activeTabId = nextActiveId;
        }
      },
      true,
    );
  };

  const changeWindowActiveTab = (windowId, tabId) => {
    return dfs(
      (window) => window.id === windowId,
      (window) => {
        window.activeTabId = tabId;
      },
      false,
    );
  };

  const render = () => {
    const recursiveRender = (currWindowTree) => {
      if (currWindowTree.type === "split") {
        const windows = currWindowTree.windows.map((window, i) =>
          recursiveRender(window),
        );
        return (
          <WindowSplit
            id={currWindowTree.id}
            isMainAxis={currWindowTree.direction === "horizontal"}
            windows={windows}
          />
        );
      } else if (currWindowTree.type === "tabGroup") {
        const tabComponents = currWindowTree.tabs.map((tab, i) => {
          let props = { id: tab.id };
          let body = null;
          if (tab.type === "editor") {
            props = {
              ...props,
              type: "editor",
              title: tab.path,
            };
            body = (
              <Editor
                filePath={tab.path}
                autoSaverInterface={autoSaverInterface}
                openEditorStatesInterface={openEditorStatesInterface}
              />
            );
          } else if (tab.type === "console") {
            props = {
              ...props,
              title: "Console",
              type: "console",
            };
            body = <Console runs={runs} runsInterface={runsInterface} />;
          } else if (tab.type === "grapher") {
            props = {
              ...props,
              title: "Grapher",
              type: "grapher",
            };
            body = <Grapher runs={runs} runsInterface={runsInterface} />;
          }

          const t = <Tab {...props}>{body}</Tab>;
          return t;
        });

        return (
          <Tile id={currWindowTree.id}>
            <TabGroup
              tabs={tabComponents}
              activeTabId={currWindowTree.activeTabId}
              onActiveTabChange={(id) =>
                changeWindowActiveTab(currWindowTree.id, id)
              }
              onTabClose={(id) => closeWindowTab(currWindowTree.id, id)}
            />
          </Tile>
        );
      }
    };

    return recursiveRender(windowTree, updateWindowTree);
  };

  const focus = (tabComparator) => {
    return dfs(
      (window) => {
        for (const tab of window.tabs) if (tabComparator(tab)) return true;
        return false;
      },
      (window) => {
        for (const tab of window.tabs) {
          if (tabComparator(tab)) {
            window.activeTabId = tab.id;
            return;
          }
        }
      },
      false,
    );
  };

  const add = (tab) => {
    dfs(
      (window) => true, // get the first one you find
      (currWindowTree) => {
        const id = generateId();
        currWindowTree.activeTabId = id;
        currWindowTree.tabs.push({ id, ...tab });
      },
    );
  };

  const windowTreeInterface = {
    focusTab: focus,
    addTab: add,
    closeTabs: closeTabs,
  };

  return [render, windowTreeInterface];
};

export default useWindowTree;
