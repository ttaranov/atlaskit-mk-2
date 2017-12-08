// @flow
import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';
import Tabs from '../src';

const Content = styled.div`
  align-items: center;
  background-color: ${themed({ light: colors.N20, dark: colors.DN10 })}
  border-radius: ${borderRadius}px
  color: ${colors.subtleText};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 4em;
  font-weight: 500;
  justify-content: center;
  margin-bottom: ${gridSize}px;
  margin-top: ${math.multiply(gridSize, 2)}px;
  padding: ${math.multiply(gridSize, 4)}px;
`;

export const tabs = [
  { label: 'Tab 1', content: <Content>One</Content>, defaultSelected: true },
  { label: 'Tab 2', content: <Content>Two</Content> },
  { label: 'Tab 3', content: <Content>Three</Content> },
  { label: 'Tab 4', content: <Content>Four</Content> },
];

export default () => (
  <Tabs tabs={tabs} onSelect={idx => console.log('Selected Tab', idx + 1)} />
);
