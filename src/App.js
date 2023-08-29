import React, { useCallback, useLayoutEffect } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  ConnectionLineType,
  Panel,
  MiniMap,
  Controls,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Position
} from "reactflow";
import dagre from "dagre";

import styled, { ThemeProvider } from "styled-components";

import { darkTheme, lightTheme } from "./theme";
import CustomNode from "./CustomNode";

import { edges as defaultEdges, nodes as defaultNodes } from "./nodes";

import "reactflow/dist/style.css";

const initialNodes = window.nodes || defaultNodes || [];
const initialEdges = window.edges || defaultEdges || [];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  custom: CustomNode
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
`;

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  "elk.algorithm": "stress",
  "elk.stress.desiredEdgeLength": 320
  // "elk.layered.nodePlacement.bk.fixedAlignment": "LEFTUP"
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      // targetPosition: isHorizontal ? "left" : "top",
      // sourcePosition: i sHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: 200,
      height: 120,
      targetPosition: "bottom",
      sourcePosition: "top"
    })),
    edges: edges
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y }
        // targetPosition: Position.Top,
        // sourcePosition: Position.Bottom
      })),

      edges: layoutedGraph.edges
    }))
    .catch(console.error);
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

          window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: "UP", useInitialNodes: true });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <ReactFlowStyled
        maxZoom={1.5}
        defaultViewport={{
          x: 0,
          y: 0,
          zoom: 0.25
        }}
        minZoom={0.25}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={nodeTypes}
      ></ReactFlowStyled>
    </ThemeProvider>
  );
};

export default () => (
  <ReactFlowProvider>
    <LayoutFlow />
  </ReactFlowProvider>
);
