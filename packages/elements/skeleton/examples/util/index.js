// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';

export const Gap = styled.div`
  width: 8px;
  display: inline-block;
`;

const DisplayCase = styled.div`
  display: flex;
`;

const ComponentContainer = styled.div`
  flex: 1 0 auto;
`;

export const ComponentDisplay = (props: { children: Node[] }) => (
  <DisplayCase>
    {React.Children.map(props.children, node => (
      <ComponentContainer>{node}</ComponentContainer>
    ))}
  </DisplayCase>
);
