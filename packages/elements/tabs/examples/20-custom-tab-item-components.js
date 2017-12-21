// @flow

import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Tabs, { TabItem } from '../src';
import { Content } from './shared';
import type { TabItemComponentProvided } from '../src/types';

export const tabs = [
  {
    label: 'Tab 1',
    content: <Content>One</Content>,
    tooltip: 'Tooltip for tab 1',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 2',
    content: <Content>Two</Content>,
    tooltip: 'Tooltip for tab 2',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 3',
    content: <Content>Three</Content>,
    tooltip: 'Tooltip for tab 3',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 4',
    content: <Content>Four</Content>,
    tooltip: 'Tooltip for tab 4',
    href: 'http://atlassian.design',
  },
];

/** This custom component wraps a tooltip around the tab item */
const TooltipItem = (props: TabItemComponentProvided) => (
  <Tooltip content={props.data.tooltip}>
    <TabItem {...props} />
  </Tooltip>
);

/** This custom component makes the tab items function like regular links */
const LinkItem = ({
  // These props will be passed down to the TabItem
  data,
  isSelected,
  // We're opting out of default keyboard navigation so we don't need the
  // following props
  innerRef,
  onKeyDown,
  tabIndex,
  // The rest we'll pass to our link
  ...linkProps
}: TabItemComponentProvided) => {
  return (
    <a
      // We add the interaction and aria props to our <a>...
      {...linkProps}
      href={data.href}
      style={{ textDecoration: 'none' }}
    >
      {/* ...then pass the data and state params on to the TabItem */}
      <TabItem data={data} isSelected={isSelected} />
    </a>
  );
};

export default () => (
  <div>
    <h3>Tabs with tooltips</h3>
    <Tabs
      onSelect={(tab, index) => console.log('Selected Tab', index + 1)}
      tabItemComponent={TooltipItem}
      tabs={tabs}
    />
    <h3>Tabs as links</h3>
    <Tabs selected={tabs[0]} tabs={tabs} tabItemComponent={LinkItem} />
  </div>
);
