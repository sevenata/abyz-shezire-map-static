import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";

const Node = styled.div`
  padding: 1.25rem 2rem;
  border-radius: 16px;
  background: ${(props) => props.theme.nodeBg};
  color: ${(props) => props.theme.nodeColor};
  border: 1px solid
    ${(props) =>
      props.selected ? props.theme.primary : props.theme.nodeBorder};

  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }
`;

export default memo(({ data, selected }) => {
  return (
    <Node selected={selected}>
      <Handle type="target" position={Position.Bottom} />
      <div>
        <strong>{data.label}</strong>
      </div>
      <Handle type="source" position={Position.Top} />
    </Node>
  );
});
