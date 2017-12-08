// @flow
/*
  eslint-disable

  jsx-a11y/role-supports-aria-props,
  jsx-a11y/no-static-element-interactions,
  react/sort-comp
*/
import React, { PureComponent } from 'react';
import { Nav, NavItem, NavLine, NavWrapper } from '../styled';
import type { TabsStatelessProps } from '../types';

type State = { wasKeyboardNav: boolean };

export default class TabsNav extends PureComponent<TabsStatelessProps, State> {
  state: State = { wasKeyboardNav: false };
  tabs = [];

  shouldComponentUpdate(nextProps: TabsStatelessProps, nextState: any) {
    // Don't re-render when we are resetting the `wasKeyboardNav` state
    if (
      nextState.wasKeyboardNav !== this.state.wasKeyboardNav &&
      !nextState.wasKeyboardNav
    ) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    // Focus the selected tab if it was selected via keyboard nav
    this.tabs.forEach(tab => {
      if (tab.el) {
        if (this.state.wasKeyboardNav && tab.isSelected) {
          tab.el.focus();
          this.setState({ wasKeyboardNav: false });
        } else {
          // Ensure that focus does not stay on an unselected tab
          tab.el.blur();
        }
      }
    });
  }

  tabKeyDownHandler = (e: KeyboardEvent) => {
    this.setState({ wasKeyboardNav: true });
    this.props.onKeyboardNav(e.key);
  };

  tabMouseDownHandler = (e: KeyboardEvent) => e.preventDefault();

  render() {
    const { tabs }: any = this.props;

    return (
      <NavWrapper>
        <NavLine status="normal" />
        <Nav role="tablist">
          {tabs.map((tab, index) => (
            <NavItem
              aria-posinset={index + 1}
              aria-selected={tab.isSelected}
              aria-setsize={tabs.length}
              innerRef={ref => {
                this.tabs.push({
                  el: ref,
                  isSelected: tab.isSelected,
                });
              }}
              isSelected={tab.isSelected} // used in testing
              key={index} // eslint-disable-line react/no-array-index-key
              onClick={typeof tab.onSelect === 'function' && tab.onSelect}
              onKeyDown={this.tabKeyDownHandler}
              onMouseDown={this.tabMouseDownHandler}
              role="tab"
              status={tab.isSelected ? 'selected' : 'normal'}
              tabIndex={tab.isSelected ? 0 : -1}
            >
              {tab.label}
              {tab.isSelected ? <NavLine status="selected" /> : null}
            </NavItem>
          ))}
        </Nav>
      </NavWrapper>
    );
    /* eslint-enable jsx-a11y/role-supports-aria-props, jsx-a11y/no-static-element-interactions */
  }
}
