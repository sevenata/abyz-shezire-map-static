import React, {useEffect, useRef, useState} from "react";

import {darkTheme, GraphCanvas, GraphCanvasRef} from 'reagraph';

const initialNodes = [];
const initialEdges = [];

// @ts-ignore
const ReactNativeWebView = window.ReactNativeWebView || {
    postMessage(){

    }
}

const LayoutFlow = () => {

    // @ts-ignore
    const [nodes, setNodes] = useState([]);
    // @ts-ignore
    const [edges, setEdges] = useState([]);
    const ref = useRef<GraphCanvasRef>(null);

    const [node, setNode] = useState<string>();

    useEffect(() => {
        const isAndroid = navigator.appVersion.includes('Android');
        const root = isAndroid ? document : window;
        const messageListener = window.addEventListener('message', (nativeEvent) => {
            // @ts-ignore
            // alert(nativeEvent.data)
            try {
                // @ts-ignore
                const rawData = nativeEvent.data;
                const data = JSON.parse(rawData);
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
            }catch (e:any) {
                // alert(JSON.stringify(e.message));
            }
        });
        return messageListener;
    }, [node]);


    // method to send msg to react native
    const sendMessage = (nodeId: string) => {
        const message = {nodeId, type: 'press'}
        ReactNativeWebView.postMessage(JSON.stringify(message));
    };

    if(!edges?.length || !nodes.length) {
        return null;
    }

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
