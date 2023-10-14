import React, {useEffect, useRef, useState} from "react";

import {darkTheme, GraphCanvas, GraphCanvasRef} from 'reagraph';

const {edges:defaultEdges, nodes:defaultNodes} = require("./nodes");

const initialNodes = defaultNodes || [];
const initialEdges = defaultEdges || [];

// @ts-ignore
const ReactNativeWebView = window.ReactNativeWebView || {
    postMessage(){

    }
}

const LayoutFlow = () => {

    // @ts-ignore
    const [nodes, setNodes] = useState(window.nodes ?? []);
    // @ts-ignore
    const [edges, setEdges] = useState(window.edges ?? []);
    const ref = useRef<GraphCanvasRef>(null);

    const [node, setNode] = useState<string>();

    useEffect(() => {
        const messageListener = window.addEventListener('message', (nativeEvent) => {
            try {
                const data = JSON.parse(nativeEvent.data);
                if(data.type === 'update'){
                    setNodes(data.nodes);
                    setEdges(data.edges);
                    // alert(JSON.stringify({
                    //     node, r: ref.current
                    // }))
                    console.info('b', node, ref.current)
                    if(node){
                        // ref.current?.centerGraph([node]);
                        setNode(undefined);
                    }
                }
            }catch (e) {
                // alert("ERROR" + JSON.stringify(e));
            }
        });
        return messageListener;
    }, [node]);


    // method to send msg to react native
    const sendMessage = (nodeId: string) => {
        const message = {nodeId, type: 'press'}
        ReactNativeWebView.postMessage(JSON.stringify(message));
    };

  return (
      <GraphCanvas
          layoutType={"hierarchicalLr"}
          ref={ref}
          sizingType={"pagerank"}
          theme={darkTheme}
          cameraMode={"rotate"}
          onNodeClick={(node)=>{
              setNode(node.id);
              sendMessage(node.id);
          }}
          labelFontUrl={"/assets/fonts/NunitoSans_10pt-Regular.ttf"}
          nodes={nodes}
          edges={edges}
          draggable={false}
          edgeArrowPosition={'none'}
      />
  );
};

export default () => (
    <LayoutFlow />
);
