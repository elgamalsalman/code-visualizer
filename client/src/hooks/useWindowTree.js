import { useEffect, useReducer, useRef, useState } from "react";
import { useImmer, useImmerReducer } from "use-immer";

import { entityTypes, getEntityMeta } from "src/models/entity/entityModels";
import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";

import WindowSplit from "src/common/components/WindowSplit/WindowSplit";
import Tile from "src/common/components/Tile/Tile";
import TabGroup from "src/components/TabGroup/TabGroup";
import Tab from "src/components/TabGroup/Tab";
import Editor from "src/containers/Editor/Editor";
import Console from "src/containers/Console/Console";
import Grapher from "src/containers/Grapher/Grapher";

const initialWindowTree = {
  type: "split",
  direction: "horizontal",
  windows: [
    {
      type: "tabGroup",
      activeTabId: "main.cpp",
      tabs: [
        { type: "editor", path: "main.cpp" },
        { type: "editor", path: "headers/vector.h" },
      ],
    },
    {
      type: "tabGroup",
      activeTabId: "console",
      tabs: [{ type: "editor", path: "main.cpp" }, { type: "console" }],
    },
  ],
};

const useWindowTree = (
  subscribe,
  unsubscribe,
  editorStates,
  registerEntityEvent,
) => {
  const [windowTree, updateWindowTree] = useImmer(initialWindowTree);

  const dfs = (windowComparator, windowUpdate) => {
    const recursiveDfs = (currWindowTree, parentWindowUpdate) => {
      if (currWindowTree.type === "split") {
        let i = 0;
        for (const subWindowTree of currWindowTree.windows) {
          let currI = i;
          if (
            recursiveDfs(subWindowTree, (subWindowUpdates) => {
              parentWindowUpdate((windowTree) => {
                subWindowUpdates(windowTree.windows[currI]);
              });
            })
          ) {
            return true; // if sub dfs worked then this one worked
          }
          i++;
        }
      } else if (currWindowTree.type === "tabGroup") {
        // if you found the window
        if (windowComparator(currWindowTree)) {
          parentWindowUpdate((windowTree) => {
            windowUpdate(windowTree);
          });
          return true;
        }
      }
      return false;
    };

    return recursiveDfs(windowTree, updateWindowTree);
  };

  const render = () => {
    const recursiveRender = (currWindowTree, updateCurrWindowTree) => {
      if (currWindowTree.type === "split") {
        const windows = currWindowTree.windows.map((window, i) =>
          recursiveRender(window, (windowSubtreeUpdate) => {
            updateCurrWindowTree((currWindowTree) => {
              const currWindows = currWindowTree.windows;
              windowSubtreeUpdate(currWindows[i]);
              // cleanup
              (() => {
                if (currWindows[i].type === "tabGroup") {
                  // delete empty tabs
                  if (currWindows[i].tabs.length === 0) {
                    currWindows.splice(i, 1);
                  }
                } else if (currWindows[i].type === "split") {
                  // collapse single child splits too
                  if (currWindows[i].windows.length === 1) {
                    currWindows[i] = currWindows[i].windows[0];
                  }
                }
              })();
            });
          }),
        );
        const windowSplitId = windows.reduce((accId, window) => {
          return `${accId}${accId !== "" ? "|" : ""}${window.props.id}`;
        }, "");
        return (
          <WindowSplit
            id={windowSplitId}
            isMainAxis={currWindowTree.direction === "horizontal"}
            windows={windows}
          />
        );
      } else if (currWindowTree.type === "tabGroup") {
        const tabs = currWindowTree.tabs.map((tab, i) => {
          let props = {};
          let body = null;
          if (tab.type === "editor") {
            props = {
              ...props,
              type: "editor",
              title: tab.path,
              id: tab.path,
            };
            body = (
              <Editor
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                filePath={tab.path}
                onNativeChange={() =>
                  registerEntityEvent(
                    tab.path,
                    getEntityEvent(
                      entityEventTypes.write,
                      getEntityMeta(tab.path, entityTypes.file),
                    ),
                  )
                }
              />
            );
          } else if (tab.type === "console") {
            props = {
              ...props,
              title: "Console",
              type: "console",
              id: "console",
            };
            body = <Console />;
          } else if (tab.type === "grapher") {
            props = {
              ...props,
              title: "Grapher",
              type: "grapher",
              id: "grapher",
            };
            body = <Grapher />;
          }

          const t = <Tab {...props}>{body}</Tab>;
          return t;
        });

        const handleActiveTabChange = (id) => {
          updateCurrWindowTree((currWindowTree) => {
            currWindowTree.activeTabId = id;
          });
        };

        const handleTabClose = (id) => {
          updateCurrWindowTree((currWindowTree) => {
            let index = null;
            let nextActiveId = null;
            for (let i = 0; i < currWindowTree.tabs.length; i++) {
              if (tabs[i].props.id === id) index = i;
              else if (nextActiveId === null) nextActiveId = tabs[i].props.id;
            }
            if (index !== null) {
              currWindowTree.tabs.splice(index, 1);
              // if active tab is deleted make another one active
              if (currWindowTree.activeTabId === id) {
                currWindowTree.activeTabId = nextActiveId;
              }
            } else console.error("deleting a tab id that doesn't exist");
          });
        };

        const tabGroupTileId = tabs.reduce((accId, tab) => {
          return `${accId}${accId !== "" ? "-" : ""}${tab.props.id}`;
        }, "");

        return (
          <Tile id={tabGroupTileId}>
            <TabGroup
              tabs={tabs}
              activeTabId={currWindowTree.activeTabId}
              onActiveTabChange={handleActiveTabChange}
              onTabClose={handleTabClose}
            />
          </Tile>
        );
      }
    };

    return recursiveRender(windowTree, updateWindowTree);
  };

  const focus = (type, path = undefined) => {
    const res = dfs(
      (window) => {
        for (const tab of window.tabs) {
          if (tab.type === type && tab.path === path) return true;
        }
        return false;
      },
      (currWindowTree) => {
        if (path) currWindowTree.activeTabId = path;
        else currWindowTree.activeTabId = type;
      },
    );
    return res;
  };

  const add = (type, path = undefined) => {
    dfs(
      (window) => {
        return true; // get the first one you find
      },
      (currWindowTree) => {
        if (path) {
          currWindowTree.activeTabId = path;
          currWindowTree.tabs.push({ type: type, path: path });
        } else {
          currWindowTree.activeTabId = type;
          currWindowTree.tabs.push({ type: type });
        }
      },
    );
  };

  return [render, focus, add];
};

export default useWindowTree;
