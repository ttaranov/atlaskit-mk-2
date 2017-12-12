// @flow

import React, { Component } from 'react';
import TabsNavigation from './TabsNavigation';
import DefaultTabContent from './TabContent';
import DefaultTabItem from './TabItem';
import { Tabs as StyledTabs } from '../styled';
import type {
  IsSelectedTestFunction,
  SelectedTabProp,
  TabData,
  TabsProps,
  TabsState,
} from '../types';

const defaultIsSelectedTestNumber: IsSelectedTestFunction = (
  selectedIndex,
  tab,
  tabIndex,
) => selectedIndex === tabIndex;

const defaultIsSelectedTestObject: IsSelectedTestFunction = (
  selectedTab,
  tab,
) => selectedTab === tab;

export default class Tabs extends Component<TabsProps, TabsState> {
  static defaultProps = {
    tabItemComponent: DefaultTabItem,
    tabContentComponent: DefaultTabContent,
  };

  constructor(props: TabsProps) {
    super(props);

    const initiallySelectedTab =
      this.props.selectedTab ||
      this.props.defaultSelectedTab ||
      this.props.tabs[0];

    const selectedTab = this.resolveSelected(initiallySelectedTab);

    this.state = {
      selectedTab,
    };
  }

  componentWillReceiveProps(newProps: TabsProps) {
    if (
      typeof newProps.selectedTab !== 'undefined' &&
      newProps.selectedTab !== this.state.selectedTab
    ) {
      const selectedTab = this.resolveSelected(newProps.selectedTab);
      this.setState({ selectedTab });
    }

    if (newProps.tabs !== this.props.tabs) {
      const updatedSelectedTab = this.resolveSelected(this.state.selectedTab);
      this.setState({ selectedTab: updatedSelectedTab });
    }
  }

  resolveSelected = (selectedTab: SelectedTabProp): TabData => {
    const { tabs, isSelectedTest } = this.props;

    const testFunction: IsSelectedTestFunction = (() => {
      if (isSelectedTest) {
        return isSelectedTest;
      }
      if (typeof selectedTab === 'number') {
        return defaultIsSelectedTestNumber;
      }
      return defaultIsSelectedTestObject;
    })();

    return (
      tabs.find((tab, tabIndex) => testFunction(selectedTab, tab, tabIndex)) ||
      tabs[0]
    );
  };

  onSelect = (newSelectedTab: TabData, newSelectedIndex: number) => {
    const { onSelect, selectedTab } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(newSelectedTab, newSelectedIndex);
    }
    if (typeof selectedTab === 'undefined') {
      this.setState({ selectedTab: newSelectedTab });
    }
  };

  render() {
    const {
      tabContentComponent: TabContent,
      tabItemComponent,
      tabs,
    } = this.props;
    const { selectedTab } = this.state;
    const tabContentProps = {
      data: selectedTab,
      elementProps: {
        role: 'tabpanel',
      },
    };
    return (
      <StyledTabs>
        <TabsNavigation
          onSelect={this.onSelect}
          selectedTab={selectedTab}
          tabItemComponent={tabItemComponent}
          tabs={tabs}
        />
        <TabContent {...tabContentProps} />
      </StyledTabs>
    );
  }
}
