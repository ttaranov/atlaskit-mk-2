// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import {
  borderRadius,
  gridSize,
  math,
  colors,
  elevation,
} from '@atlaskit/theme';

const Container = styled.div`
  border-radius: ${borderRadius}px;
  background-color: ${colors.N0};
  box-sizing: border-box;
  ${elevation.e500};
  width: ${math.multiply(gridSize, 5 * 8)}px;
  position: fixed;
  z-index: 1000;
  top: ${math.multiply(gridSize, 2)}px;
  right: ${math.multiply(gridSize, 2)}px;
`;

const Header = styled.div`
  padding: ${math.multiply(gridSize, 2)}px;
  cursor: move;
`;

const Content = styled.div`
  padding: 0 ${math.multiply(gridSize, 2)}px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  padding: ${math.multiply(gridSize, 2)}px;
  *:not(:last-child) {
    margin-right: ${gridSize}px;
  }
`;

type Props = {
  header: Node,
  footer: Node,
  children: Node,
};

const Popup = ({ children, header, footer }) => (
  <Draggable handle=".handle">
    <Container>
      <Header className="handle">{header}</Header>
      <Content>{children}</Content>
      <Footer>{footer}</Footer>
    </Container>
  </Draggable>
);

export default Popup;
