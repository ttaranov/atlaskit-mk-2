// @flow

import { shallow } from 'enzyme';
import React from 'react';

import { Grid } from '@atlaskit/page';
import { ThemeProvider } from 'styled-components';
import ProgressTracker from '../index';
import ProgressTrackerStage from '../../ProgressTrackerStage';
import { ProgressTrackerContainer } from '../styled';

const items = [
  {
    id: 'disabled-1',
    label: 'Disabled Step',
    percentageComplete: 100,
    status: 'disabled',
    href: '#',
  },
  {
    id: 'visited-1',
    label: 'Visited Step',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'current-1',
    label: 'Current Step',
    percentageComplete: 0,
    status: 'current',
    href: '#',
  },
  {
    id: 'unvisited-1',
    label: 'Unvisited Step 1',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: 'unvisited-2',
    label: 'Unvisited Step 2',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
  {
    id: 'unvisited-3',
    label: 'Unvisited Step 3',
    percentageComplete: 0,
    status: 'unvisited',
    href: '#',
  },
];

describe('ak-progress-tracker/progress-tracker', () => {
  it('should render the component', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    expect(wrapper.length).toBeGreaterThan(0);
    expect(wrapper.find(ProgressTrackerContainer)).toHaveLength(1);
    expect(wrapper.find(Grid)).toHaveLength(1);
    expect(wrapper.find(ThemeProvider)).toHaveLength(1);
    expect(wrapper.find(ProgressTrackerStage)).toHaveLength(6);
  });

  it('should create default theme correctly', () => {
    const wrapper = shallow(<ProgressTracker items={items} />);
    expect(wrapper.find(ThemeProvider).props().theme).toMatchObject({
      spacing: 'cosy',
      columns: 12,
    });
  });
});
