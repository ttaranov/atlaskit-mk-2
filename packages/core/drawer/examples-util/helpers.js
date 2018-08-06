// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import { colors, math, gridSize } from '@atlaskit/theme';

const Wrapper = styled.div`
  bottom: 0;
  height: auto;
  border: 1px solid #333;
  left: 0;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  padding: 20px;
`;

const ChildrenWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

export const BlockWithChildren = ({ children }: { children: ?Node }) => (
  <Wrapper>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </Wrapper>
);
