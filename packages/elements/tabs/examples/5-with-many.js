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
  font-size: 1.1em;
  font-weight: 500;
  justify-content: center;
  margin-bottom: ${gridSize}px;
  margin-top: ${math.multiply(gridSize, 2)}px;
  padding: ${math.multiply(gridSize, 4)}px;
`;

function handleTabSelect(selectedTabIndex) {
  console.info(`Switched to tab at index ${selectedTabIndex}`);
}

export default () => (
  <Tabs
    onSelect={handleTabSelect}
    tabs={[
      {
        label: 'Tab 1',
        content: <Content>Tab 1 content</Content>,
        defaultSelected: true,
      },
      { label: 'Tab 2', content: <Content>Tab 2 content</Content> },
      { label: 'Tab 3', content: <Content>Tab 3 content</Content> },
      { label: 'Tab 4', content: <Content>Tab 4 content</Content> },
      { label: 'Tab 5', content: <Content>Tab 5 content</Content> },
      { label: 'Tab 6', content: <Content>Tab 6 content</Content> },
      { label: 'Tab 7', content: <Content>Tab 7 content</Content> },
      { label: 'Tab 8', content: <Content>Tab 8 content</Content> },
      { label: 'Tab 9', content: <Content>Tab 9 content</Content> },
      { label: 'Tab 10', content: <Content>Tab 10 content</Content> },
    ]}
  />
);
