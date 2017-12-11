// @flow
import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';
import Lorem from 'react-lorem-component';
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
        content: (
          <Content>
            <Lorem count="1" />
          </Content>
        ),
        label: 'Details',
      },
      {
        content: (
          <Content>
            <Lorem count="1" seed="1" />
          </Content>
        ),
        label: 'Diff',
      },
      {
        content: (
          <Content>
            <Lorem count="1" seed="2" />
          </Content>
        ),
        label: 'Commits',
      },
      {
        content: (
          <Content>
            <Lorem count="1" seed="3" />
          </Content>
        ),
        label: 'Pipeline',
      },
    ]}
  />
);
