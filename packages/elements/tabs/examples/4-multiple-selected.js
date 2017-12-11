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
        content: (
          <Content>
            <p>Tab 1 should be selected.</p>
            <p>
              If multiple tabs have <em>defaultSelected: true</em>, then the
              first of these tabs should be selected.
            </p>
          </Content>
        ),
        defaultSelected: true,
        label: 'Tab 1 should be selected',
      },
      {
        content: (
          <Content>
            <p>Tab 2 should not be selected.</p>
          </Content>
        ),
        defaultSelected: true,
        label: 'Tab 2',
      },
      {
        content: (
          <Content>
            <p>Tab 3 should not be selected.</p>
          </Content>
        ),
        defaultSelected: true,
        label: 'Tab 3',
      },
    ]}
  />
);
