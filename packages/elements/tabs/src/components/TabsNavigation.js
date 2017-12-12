// @flow

import React, { Component } from 'react';
import { Nav, NavLine, NavWrapper } from '../styled';
import type { TabData, TabsNavigationProps } from '../types';

export default class TabsNavigation extends Component<TabsNavigationProps> {
  elementRefs: Array<HTMLElement> = [];

  componentWillReceiveProps(newProps: TabsNavigationProps) {
    if (newProps.tabs !== this.props.tabs) {
      this.elementRefs = [];
    }
  }

  tabKeyDownHandler = (e: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      return;
    }

    const { selectedTab, tabs } = this.props;
    const modifier = e.key === 'ArrowRight' ? 1 : -1;
    const newSelectedTabIndex = tabs.indexOf(selectedTab) + modifier;

    if (newSelectedTabIndex < 0 || newSelectedTabIndex >= tabs.length) {
      return;
    }

    this.onSelect(tabs[newSelectedTabIndex], newSelectedTabIndex);
    this.elementRefs[newSelectedTabIndex].focus();
  };

  onSelect = (selectedTab: TabData, selectedTabIndex: number) => {
    this.props.onSelect(selectedTab, selectedTabIndex);
  };

  tabMouseDownHandler = (e: MouseEvent) => e.preventDefault();

  render() {
    const { selectedTab, tabItemComponent: TabItem, tabs } = this.props;

    return (
      <NavWrapper>
        <NavLine status="normal" />
        <Nav role="tablist">
          {tabs.map((tab, index) => {
            const isSelected = tab === selectedTab;
            const elementProps = {
              'aria-posinset': index + 1,
              'aria-selected': isSelected,
              'aria-setsize': tabs.length,
              onClick: () => this.onSelect(tab, index),
              onKeyDown: this.tabKeyDownHandler,
              onMouseDown: this.tabMouseDownHandler,
              role: 'tab',
              tabIndex: isSelected ? 0 : -1,
            };
            const elementRef = (ref: HTMLElement) => {
              this.elementRefs[index] = ref;
            };

            const tabItemProps = {
              elementProps,
              elementRef,
              data: tab,
              isSelected,
            };

            // eslint-disable-next-line react/no-array-index-key
            return <TabItem key={index} {...tabItemProps} />;
          })}
        </Nav>
      </NavWrapper>
    );
  }
}
