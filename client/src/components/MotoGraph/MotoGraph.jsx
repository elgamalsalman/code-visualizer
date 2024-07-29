import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  MarkerType,
  ReactFlowProvider,
} from "@xyflow/react";
import clsx from "clsx";
import styles from "./MotoGraph.module.css";

import MotoGraphNode from "./MotoGraphNode.jsx";

// TODO: subscribe to ReactFlow once you start making money
const proOptions = { hideAttribution: true };

const nodeTypes = {
  motoGraphNode: MotoGraphNode,
};

const baseTargetNodes = [
  {
    id: "code",
    type: "motoGraphNode",
    data: {
      label: "code",
      noTargetHandle: true,
      isBeingDragged: false,
      isActive: false,
      description: {
        address: "0xbbbb01",
        value: '"code"',
        next: "0xbbbb02",
      },
    },
    fractionalPosition: { x: 0, y: 0 },
    // fractionalPosition: { x: 0.7, y: 0.6 },
  },
  {
    id: "visualize",
    type: "motoGraphNode",
    data: {
      label: "visualize",
      isBeingDragged: false,
      isActive: false,
      description: {
        address: "0xbbbb02",
        value: '"visualize"',
        next: "0xbbbb05",
      },
    },
    fractionalPosition: { x: 0.3, y: 0.4 },
    // fractionalPosition: { x: 0.7, y: 0.7 },
  },
  {
    id: "interact",
    type: "motoGraphNode",
    data: {
      label: "interact",
      noSourceHandle: true,
      isBeingDragged: false,
      isActive: false,
      description: {
        address: "0xbbbb05",
        value: '"interact"',
        next: "nullptr",
      },
    },
    fractionalPosition: { x: 0.7, y: 0.8 },
  },
];
const targetNodesExpanded = baseTargetNodes;
const targetNodesCompact = [
  baseTargetNodes[0],
  baseTargetNodes[1],
  {
    ...baseTargetNodes[2],
    fractionalPosition: { x: 0.3, y: baseTargetNodes[2].fractionalPosition.y },
  },
];
const getTargetNodes = (compact, offset, dimensions) => {
  const targetNodes = compact ? targetNodesCompact : targetNodesExpanded;
  return targetNodes.map((node) => {
    return {
      ...node,
      position: {
        x: node.fractionalPosition.x * dimensions.x + offset.x,
        y: node.fractionalPosition.y * dimensions.y + offset.y,
      },
    };
  });
};
const nodeBaseSpeed = 0;
const nodeDistanceSpeedFactor = 10;
const nodeMovementIntervalTime = 10;
const distanceEpsilon = 10;
const edges = [
  {
    id: "e1",
    source: "code",
    target: "visualize",
    // animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: {
      strokeWidth: 2,
      strokeDasharray: "0.5em",
      animationName: styles["edge-animation"],
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
    },
  },
  {
    id: "e2",
    source: "visualize",
    target: "interact",
    // animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: {
      strokeWidth: 2,
      strokeDasharray: "0.5em",
      animationName: styles["edge-animation"],
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
    },
  },
];

function MotoGraph({ className, compact, offset, dimensions }) {
  const targetNodesRef = useRef(getTargetNodes(compact, offset, dimensions));
  const [nodes, setNodes, onNodesChange] = useNodesState(
    targetNodesRef.current,
  );

  const prevOffsetRef = useRef(offset);
  useEffect(() => {
    const offsetDelta = {
      x: offset.x - prevOffsetRef.current.x,
      y: offset.y - prevOffsetRef.current.y,
    };
    const nodeUpdater = (node) => {
      return {
        ...node,
        position: {
          x: node.position.x + offsetDelta.x,
          y: node.position.y + offsetDelta.y,
        },
      };
    };
    setNodes((nodes) => {
      return nodes.map((node) => nodeUpdater(node));
    });
    targetNodesRef.current = targetNodesRef.current.map((node) =>
      nodeUpdater(node),
    );
    prevOffsetRef.current = offset;
  }, [offset, setNodes]);

  const prevDimensionsRef = useRef(dimensions);
  useEffect(() => {
    const dimensionsDelta = {
      x: dimensions.x - prevDimensionsRef.current.x,
      y: dimensions.y - prevDimensionsRef.current.y,
    };
    const nodeUpdater = (node) => {
      return {
        ...node,
        position: {
          x: node.position.x + node.fractionalPosition.x * dimensionsDelta.x,
          y: node.position.y + node.fractionalPosition.y * dimensionsDelta.y,
        },
      };
    };
    setNodes((nodes) => {
      return nodes.map((node) => nodeUpdater(node));
    });
    targetNodesRef.current = targetNodesRef.current.map((node) =>
      nodeUpdater(node),
    );
    prevDimensionsRef.current = dimensions;
  }, [dimensions, setNodes]);

  // node activity
  const [activeNodes, setActiveNodes] = useState(() => {
    const activeNodes = {};
    targetNodesRef.current.forEach((node) => {
      activeNodes[node.id] = false;
    });
    return activeNodes;
  });
  const activateNode = useCallback(
    (nodeId, activity) => {
      setActiveNodes((activeNodes) => {
        return { ...activeNodes, [nodeId]: activity };
      });
      setNodes((nodes) => {
        return nodes.map((node) => {
          if (node.id !== nodeId) return node;
          else
            return {
              ...node,
              data: { ...node.data, isActive: activity },
            };
        });
      });
    },
    [setActiveNodes, setNodes],
  );

  // move dragged nodes back
  useEffect(() => {
    const timeInterval = nodeMovementIntervalTime;
    let isAnyNodeActive = false;
    for (const id in activeNodes) if (activeNodes[id]) isAnyNodeActive = true;
    const interval = isAnyNodeActive
      ? setInterval(() => {
          nodes.forEach((node, index) => {
            if (!activeNodes[node.id]) return;

            const targetNode = targetNodesRef.current[index];
            const delta = {
              x: targetNode.position.x - node.position.x,
              y: targetNode.position.y - node.position.y,
            };
            const deltaMagnitude = Math.sqrt(
              delta.x * delta.x + delta.y * delta.y,
            );

            if (deltaMagnitude < distanceEpsilon) {
              activateNode(node.id, false);
            }
          });
          setNodes((nodes) => {
            return nodes.map((node, index) => {
              if (!activeNodes[node.id]) return node;

              const targetNode = targetNodesRef.current[index];
              const delta = {
                x: targetNode.position.x - node.position.x,
                y: targetNode.position.y - node.position.y,
              };
              const deltaMagnitude = Math.sqrt(
                delta.x * delta.x + delta.y * delta.y,
              );
              const deltaNormalized = {
                x: delta.x / deltaMagnitude,
                y: delta.y / deltaMagnitude,
              };

              if (deltaMagnitude < distanceEpsilon) {
                return node;
              } else {
                return {
                  ...node,
                  position: {
                    x:
                      node.position.x +
                      (timeInterval / 1000) *
                        (nodeBaseSpeed +
                          deltaMagnitude * nodeDistanceSpeedFactor) *
                        deltaNormalized.x,
                    y:
                      node.position.y +
                      (timeInterval / 1000) *
                        (nodeBaseSpeed +
                          deltaMagnitude * nodeDistanceSpeedFactor) *
                        deltaNormalized.y,
                  },
                };
              }
            });
          });
        }, timeInterval)
      : undefined;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [nodes, activeNodes, setNodes, activateNode]);

  return (
    <ReactFlow
      className={clsx(className, styles["react-flow"])}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      preventScrolling
      zoomOnDoubleClick={false}
      zoomOnPinch={false}
      zoomOnScroll={false}
      panOnDrag={false}
      panOnScroll={false}
      viewport={{ x: 0, y: 0, zoom: 1 }}
      onNodeDragStart={(event, draggedNode, nodes) => {
        activateNode(draggedNode.id, false);
        setNodes((nodes) => {
          return nodes.map((node) => {
            if (node.id === draggedNode.id)
              return {
                ...node,
                data: { ...node.data, isBeingDragged: true },
              };
            else return node;
          });
        });
      }}
      onNodeDragStop={(event, draggedNode, nodes) => {
        activateNode(draggedNode.id, true);
        setNodes((nodes) => {
          return nodes.map((node) => {
            if (node.id === draggedNode.id)
              return {
                ...node,
                data: { ...node.data, isBeingDragged: false },
              };
            else return node;
          });
        });
      }}
      proOptions={proOptions}
    ></ReactFlow>
  );
}

const MotoGraphWrapper = (props) => {
  return (
    <ReactFlowProvider>
      <MotoGraph {...props} />
    </ReactFlowProvider>
  );
};

export default MotoGraphWrapper;
