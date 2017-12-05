// @flow
/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';

import TabsNav from './TabsNav';
import { TabPane, Tabs } from '../styled';
import type { TabsStatelessProps } from '../types';

export default class TabsStateless extends PureComponent<
  TabsStatelessProps,
  void,
> {
  props: TabsStatelessProps;
  static defaultProps = { tabs: [] };

  render() {
    const { onKeyboardNav, tabs }: any = this.props;
    const selectedTabs = tabs.filter(tab => tab.isSelected);
    const selectedTab = selectedTabs.length ? (
      <TabPane role="tabpanel">{selectedTabs[0].content}</TabPane>
    ) : null;

    return (
      <Tabs>
        <TabsNav onKeyboardNav={onKeyboardNav} tabs={tabs} />
        {selectedTab}
      </Tabs>
    );
  }
}
