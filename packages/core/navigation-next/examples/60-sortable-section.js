// @flow

import React, { Component } from 'react';
import { colors } from '@atlaskit/theme';

import { SortableSection } from '../src';
import type {
  GroupsType,
  ItemsType,
} from '../src/components/presentational/SortableSection/types';
import { CONTENT_NAV_WIDTH } from '../src/common/constants';

const SectionWrapper = (props: *) => (
  <div
    css={{
      backgroundColor: colors.N20,
      height: '100%',
      overflow: 'hidden',
      paddingBottom: 8,
      position: 'relative',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
    {...props}
  />
);

const DEFAULT_ITEMS = {
  dashboards: { text: 'Dashboards', onClick: () => console.log('dashboards') },
  projects: { text: 'Projects', onClick: () => console.log('projectcs') },
  settings: { text: 'Settings', onClick: () => console.log('settings') },
  backlog: { text: 'Backlog', onClick: () => console.log('backlog') },
  'active-sprint': {
    text: 'Active Sprint',
    onClick: () => console.log('active-sprint'),
  },
  'issues-and-filters': {
    text: 'Issues and filters',
    onClick: () => console.log('issues-and-filters'),
  },
  reports: { text: 'Reports', onClick: () => console.log('reports') },
  'viewed-recently': {
    text: 'Viewed Recently',
    onClick: () => console.log('viewed-recently'),
  },
};
function getDefaultItems() {
  return DEFAULT_ITEMS;
}
function getItemIds(from: number, to: number): Array<string> {
  return Object.keys(DEFAULT_ITEMS).splice(from, to);
}

type Props = {
  items: ItemsType,
};
type State = {
  groups: GroupsType,
  showContainer: boolean,
};

export default class Example extends Component<Props, State> {
  static defaultProps = {
    items: getDefaultItems(),
  };
  state = {
    groups: [
      {
        id: 'first',
        heading: 'First',
        itemIds: getItemIds(0, 4),
        hasSeparator: false,
      },
      {
        id: 'second',
        heading: 'Second',
        itemIds: getItemIds(4, 8),
        hasSeparator: false,
      },
    ],
    showContainer: true,
  };
  onChange = (groups: GroupsType) => {
    this.setState({ groups });
  };
  render() {
    return (
      <SectionWrapper>
        {/* <ViewRenderer items={this.props.items} /> */}
        <SortableSection
          itemsMap={this.props.items}
          groups={this.state.groups}
          onChange={this.onChange}
        />
      </SectionWrapper>
    );
  }
}
