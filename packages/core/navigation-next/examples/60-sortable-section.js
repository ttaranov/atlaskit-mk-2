// @flow

import React, { Component } from 'react';
import { colors } from '@atlaskit/theme';

import { SortableSection } from '../src';
import type {
  GroupsType,
  ItemsType,
} from '../src/components/SortableSection/types';
import { CONTENT_NAV_WIDTH } from '../src/common/constants';

const SectionWrapper = props => (
  <div
    css={{
      backgroundColor: colors.N20,
      overflow: 'hidden',
      paddingBottom: 8,
      position: 'relative',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
    {...props}
  />
);

function getDefaultItems(from, to) {
  const items = {
    dashboards: { text: 'Dashboards' },
    projects: { text: 'Projects' },
    settings: { text: 'Settings' },
    backlog: { text: 'Backlog' },
    'active-sprint': { text: 'Active Sprint' },
    'issues-and-filters': { text: 'Issues and filters' },
    reports: { text: 'Reports' },
    'viewed-recently': { text: 'Viewed Recently' },
  };

  // get ids
  if (from || to) {
    return Object.keys(items).splice(from, to);
  }

  return items;
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
      { id: 'first', heading: 'First', itemIds: getDefaultItems(0, 4) },
      { id: 'second', heading: 'Second', itemIds: getDefaultItems(4, 8) },
    ],
    showContainer: true,
  };
  onChange = groups => {
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
