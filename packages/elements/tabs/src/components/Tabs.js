// @flow

import React, { Component } from 'react';
import TabsNavigation from './TabsNavigation';
import DefaultTabContent from './TabContent';
import DefaultTabItem from './TabItem';
import { Tabs as StyledTabs } from '../styled';
import type {
  IsSelectedTestFunction,
  selectedProp,
  TabData,
  TabsProps,
  TabsState,
} from '../types';

const defaultIsSelectedTestNumber: IsSelectedTestFunction = (
  selectedIndex,
  tab,
  tabIndex,
) => selectedIndex === tabIndex;

const defaultIsSelectedTestObject: IsSelectedTestFunction = (selected, tab) =>
  selected === tab;

export default class Tabs extends Component<TabsProps, TabsState> {
  static defaultProps = {
    tabItemComponent: DefaultTabItem,
    tabContentComponent: DefaultTabContent,
  };

  constructor(props: TabsProps) {
    super(props);

    const initiallyselected =
      this.props.selected || this.props.defaultSelected || this.props.tabs[0];

    const selected = this.resolveSelected(initiallyselected);

    this.state = {
      selected,
    };
  }

  componentWillReceiveProps(newProps: TabsProps) {
    if (
      typeof newProps.selected !== 'undefined' &&
      newProps.selected !== this.state.selected
    ) {
      const selected = this.resolveSelected(newProps.selected);
      this.setState({ selected });
    }

    if (newProps.tabs !== this.props.tabs) {
      const updatedselected = this.resolveSelected(this.state.selected);
      this.setState({ selected: updatedselected });
    }
  }

  resolveSelected = (selected: selectedProp): TabData => {
    const { tabs, isSelectedTest } = this.props;

    const testFunction: IsSelectedTestFunction = (() => {
      if (isSelectedTest) {
        return isSelectedTest;
      }
      if (typeof selected === 'number') {
        return defaultIsSelectedTestNumber;
      }
      return defaultIsSelectedTestObject;
    })();

    return (
      tabs.find((tab, tabIndex) => testFunction(selected, tab, tabIndex)) ||
      tabs[0]
    );
  };

  onSelect = (newselected: TabData, newSelectedIndex: number) => {
    const { onSelect, selected } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(newselected, newSelectedIndex);
    }
    if (typeof selected === 'undefined') {
      this.setState({ selected: newselected });
    }
  };

  render() {
    const {
      tabContentComponent: TabContent,
      tabItemComponent,
      tabs,
    } = this.props;
    const { selected } = this.state;
    const tabContentProps = {
      data: selected,
      elementProps: {
        role: 'tabpanel',
      },
    };
    return (
      <StyledTabs>
        <TabsNavigation
          onSelect={this.onSelect}
          selected={selected}
          tabItemComponent={tabItemComponent}
          tabs={tabs}
        />
        <TabContent {...tabContentProps} />
      </StyledTabs>
    );
  }
}
