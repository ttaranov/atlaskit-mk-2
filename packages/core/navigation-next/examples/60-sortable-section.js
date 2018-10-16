// @flow

import React, { Component } from 'react';
import { colors } from '@atlaskit/theme';

import { SortableSection } from '../src';
import type {
  GroupsType,
  ItemsType,
} from '../src/components/SortableSection/types';
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
  dashboards: { text: 'Dashboards' },
  projects: { text: 'Projects' },
  settings: { text: 'Settings' },
  backlog: { text: 'Backlog' },
  'active-sprint': { text: 'Active Sprint' },
  'issues-and-filters': { text: 'Issues and filters' },
  reports: { text: 'Reports' },
  'viewed-recently': { text: 'Viewed Recently' },
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
          items={this.props.items}
          groups={this.state.groups}
          onChange={this.onChange}
        />
      </SectionWrapper>
    );
  }
}
