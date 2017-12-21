// @flow

import React from 'react';
import styled from 'styled-components';
import Tabs from '../src';
import type { TabContentComponentProvided } from '../src/types';

const Content = styled.div`
  padding: 20px;
`;

export const tabs = [
  {
    label: 'Tab 1',
    heading: 'Tab One',
    body: 'This is tab one.',
  },
  {
    label: 'Tab 2',
    heading: 'Tab Two',
    body: 'This is tab two.',
  },
  {
    label: 'Tab 3',
    heading: 'Tab Three',
    body: 'This is tab three.',
  },
  {
    label: 'Tab 4',
    heading: 'Tab Four',
    body: 'This is tab four.',
  },
];

const CustomContent = ({ data, elementProps }: TabContentComponentProvided) => (
  <Content {...elementProps}>
    <h3>{data.heading}</h3>
    <p>{data.body}</p>
  </Content>
);

export default () => (
  <div>
    <Tabs
      onSelect={(tab, index) => console.log('Selected Tab', index + 1)}
      tabContentComponent={CustomContent}
      tabs={tabs}
    />
  </div>
);
