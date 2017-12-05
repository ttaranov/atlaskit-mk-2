// @flow
import React from 'react';
import { akColorN100 } from '@atlaskit/util-shared-styles';
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

export default () => (
  <div
    style={{
      width: 400,
      height: 200,
      margin: '16px auto',
      border: `1px dashed ${akColorN100}`,
      display: 'flex',
    }}
  >
    <Tabs
      tabs={[
        {
          label: 'Here is an incredibly super long label, too long really',
          defaultSelected: true,
          content: <Content>Content is here</Content>,
        },
        {
          label: 'here, a short label',
          defaultSelected: true,
          content: <Content>Content is here</Content>,
        },
      ]}
    />
  </div>
);
