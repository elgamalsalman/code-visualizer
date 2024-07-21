import React, { useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./ReactFlowTheme.css";
import styles from "./GrapherInsert.module.css";

import RunButton, {
  runButtonStatuses,
} from "src/common/components/RunButton/RunButton";
import {
  grapherEventTypes,
  runEventTypes,
} from "src/models/run/runEventModels";
import { useAppStatusContext } from "src/hooks/useAppStatusContext";

// TODO: subscribe to ReactFlow once you start making money
const proOptions = { hideAttribution: true };
const nullptr = "0x0";
const defaultValue = "-1";

const GrapherInsert = ({ run, showMiniMap }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const statesRef = useRef([{ nodes: [], edges: [] }]);

  // TODO: this is pretty inefficient
  // create a timeline of states with every run update and
  // set nodes and edges to the last state in the timeline
  useEffect(() => {
    // get grapher events
    let grapherEvents = [];
    const isRunAvailable = run !== null;
    if (isRunAvailable) {
      grapherEvents = run.data
        .filter((event) => event.type === runEventTypes.grapher)
        .map((grapherEvent) => grapherEvent.event);
    }
    console.log("run");
    console.log(run);
    console.log("grapherEvents");
    console.log(grapherEvents);

    let yCounter = 0;
    statesRef.current = [{ nodes: [], edges: [] }];
    const states = statesRef.current;
    for (const grapherEvent of grapherEvents) {
      const previousState = states[states.length - 1];
      const newState = {
        nodes: [...previousState.nodes],
        edges: [...previousState.edges],
      };
      if (grapherEvent.type === grapherEventTypes.create) {
        const value = grapherEvent.props.value;
        newState.nodes.push({
          id: grapherEvent.id,
          data: { label: value ? value : defaultValue },
          position: { x: 0, y: yCounter },
        });
        yCounter += 100;

        // if it is pointing to something
        if (
          grapherEvent.props.next !== undefined &&
          grapherEvent.props.next !== nullptr
        ) {
          const source = grapherEvent.id;
          const target = grapherEvent.props.next;
          newState.edges.push({
            id: `e-${source}`,
            source: source,
            target: target,
            markerEnd: {
              type: MarkerType.Arrow,
              width: 30,
              height: 30,
            },
          });
        }
      } else if (grapherEvent.type === grapherEventTypes.change) {
        if (grapherEvent.props.value !== undefined) {
          newState.nodes = newState.nodes.map((node) => {
            if (node.id === grapherEvent.id) {
              return { ...node, data: { label: grapherEvent.props.value } };
            } else return node;
          });
        }

        if (grapherEvent.props.next) {
          newState.edges = newState.edges.filter(
            (edge) => edge.source !== grapherEvent.id,
          );
          if (grapherEvent.props.next !== nullptr) {
            newState.edges.push({
              id: `e-${grapherEvent.id}`,
              source: grapherEvent.id,
              target: grapherEvent.props.next,
              markerEnd: {
                type: MarkerType.Arrow,
                width: 30,
                height: 30,
              },
            });
          }
        }
      } else if (grapherEvent.type === grapherEventTypes.delete) {
        // remove node
        newState.nodes = newState.nodes.filter(
          (node) => node.id !== grapherEvent.id,
        );
        // remove edges coming out of the removed node
        newState.edges = newState.edges.filter(
          (edge) => edge.source !== grapherEvent.id,
        );
      }
      states.push(newState);
    }

    const { nodes: finalNodes, edges: finalEdges } = states[states.length - 1];
    setNodes(finalNodes);
    setEdges(finalEdges);

    console.log("nodes");
    console.log(nodes);
    console.log("edges");
    console.log(edges);
  }, [run]);

  return (
    <div className={styles["grapher-insert"]}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={proOptions}
        colorMode={"dark"}
      >
        <Background variant={BackgroundVariant.Dots} />
        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            draggable
            nodeColor={() => "#ffffff" /* just a placeholder */}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default GrapherInsert;
