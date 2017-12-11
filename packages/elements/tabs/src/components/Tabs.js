// @flow
/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';
import TabsStateless from './TabsStateless';
import type { StatefulTabs, StatelessTabs } from '../types';

type Props = {
  /** Handler for selecting a new tab. Called with the number of the tab, zero-indexed */
  onSelect?: number => void,
  /** The tabs to display, with content being hidden unless the tab is selected. */
  tabs: StatefulTabs,
};
type State = {
  selectedTab: number | null,
};

export default class Tabs extends PureComponent<Props, State> {
  static defaultProps = {
    onSelect: () => {},
    tabs: [],
  };
  state: State = { selectedTab: null };
  constructor(props: Props) {
    super(props);

    // Set the selected tab to the first tab with defaultSelected provided
    let defaultSelectedIndex = null;
    if (props) {
      for (let i = 0; i < props.tabs.length; i++) {
        // eslint-disable-line no-plusplus
        if (props.tabs[i].defaultSelected) {
          defaultSelectedIndex = i;
          break;
        }
      }
    }

    this.state = {
      selectedTab: defaultSelectedIndex,
    };
  }

  getTabs = (): StatelessTabs =>
    this.props.tabs.map((tab, index) => ({
      ...tab,
      isSelected: index === this.state.selectedTab,
      onKeyboardNav: this.tabKeyboardNavHandler,
      onSelect: () => this.tabSelectHandler(index),
    }));

  tabSelectHandler = (selectedTabIndex: number) => {
    if (this.props.onSelect) {
      this.props.onSelect(selectedTabIndex);
    }

    this.setState({ selectedTab: selectedTabIndex });
  };

  tabKeyboardNavHandler = (key: string) => {
    // Handle left and right arrow key presses by selecting the previous or next tab

    const selectedIndex = this.state.selectedTab;
    if (selectedIndex !== null) {
      let nextIndex = selectedIndex;

      if (key === 'ArrowLeft') {
        nextIndex =
          Number(selectedIndex) - 1 < 0 ? 0 : Number(selectedIndex) - 1;
      } else if (key === 'ArrowRight') {
        nextIndex =
          selectedIndex + 1 > this.props.tabs.length - 1
            ? this.props.tabs.length - 1
            : selectedIndex + 1;
      }

      if (nextIndex !== selectedIndex) {
        this.tabSelectHandler(Number(nextIndex));
      }
    }
  };

  render() {
    return (
      <TabsStateless
        onKeyboardNav={this.tabKeyboardNavHandler}
        tabs={this.getTabs()}
      />
    );
  }
}
