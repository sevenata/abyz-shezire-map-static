import React, {useEffect, useRef, useState} from "react";

import {darkTheme, GraphCanvas, GraphCanvasRef} from 'reagraph';
import {Canvas, CanvasRef, Node} from "reaflow";

const initialNodes = [];
const initialEdges = [];

// @ts-ignore
const ReactNativeWebView = window.ReactNativeWebView || {
    postMessage(){

    }
}

const LayoutFlow = () => {

    const mapNode = (v:any)=>({
        id: v.id,
        text: v.label,
    })

    const mapEdge = (v:any)=>({
        id: v.id,
        from: v.source,
        to: v.target,
    });

    // @ts-ignore
    const [nodes, setNodes] = useState(window.nodes.map(v=>mapNode(v)) ?? []);
    // @ts-ignore
    const [edges, setEdges] = useState(window.edges.map(v=>mapEdge(v)) ?? []);
    // const ref = useRef<GraphCanvasRef>(null);

    const [node, setNode] = useState<string>();

    const ref = useRef<CanvasRef | null>(null);

    useEffect(() => {
        const isAndroid = navigator.appVersion.includes('Android');
        const root = isAndroid ? document : window;
        const messageListener = root.addEventListener('message', (nativeEvent) => {
            // @ts-ignore
            // alert(nativeEvent.data)
            try {
                // @ts-ignore
                const rawData = nativeEvent.data;
                const data = JSON.parse(rawData);
                if(data.type === 'update'){
                    setNodes(data.nodes.map((v:any)=>mapNode(v)));
                    setEdges(data.edges.map((v:any)=>mapEdge(v)));
                    if(node){
                        setNode(undefined);
                    }
                }
            }catch (e:any) {
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

    return <Canvas
        ref={ref}
        nodes={nodes}
        // @ts-ignore
        edges={edges}
        // node={Node}
        minZoom={-0.75}
        maxZoom={1}
        maxWidth={5e3}
        maxHeight={5e3}
        node={<Node onClick={(event, data) => {
            setNode(data.id);
            sendMessage(data.id);
        }}/>}
        // arrow={<MarkerArrow style={{ fill: gray400 }} />}
        // edge={
        //     <Edge
        //         style={{ stroke: gray300 }}
        //         onClick={(event, edge) => {
        //             console.log("Selecting Edge", event, edge);
        //         }}
        //     />
        // }
        // onLayoutChange={(layout) => console.log("Layout", layout)}
        // readonly
    />

  // return (
  //     <GraphCanvas
  //         layoutType={"treeTd2d"}
  //         ref={ref}
  //         sizingType={"pagerank"}
  //         theme={darkTheme}
  //         cameraMode={"rotate"}
  //         onNodeClick={(node)=>{
  //             setNode(node.id);
  //             sendMessage(node.id);
  //         }}
  //         labelFontUrl={"/assets/fonts/NunitoSans_10pt-Regular.ttf"}
  //         nodes={nodes}
  //         edges={edges}
  //         draggable={false}
  //         edgeArrowPosition={'none'}
  //     />
  // );
};

export default () => (
    <LayoutFlow />
);
