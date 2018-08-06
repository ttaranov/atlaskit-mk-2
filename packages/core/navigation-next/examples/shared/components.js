// @flow
/* eslint-disable react/no-multi-comp */

import React, { PureComponent } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { withRouter } from 'react-router-dom';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';

import { GlobalNav, ItemAvatar } from '../../src';
import { globalNavPrimaryItems, globalNavSecondaryItems } from './mock-data';

const gridSize = gridSizeFn();

// ==============================
// Simple global navigation
// ==============================
export const DefaultGlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

// ==============================
// Project Switcher
// ==============================
const SwitcherBefore = itemState => (
  <ItemAvatar itemState={itemState} appearance="square" />
);
class Switcher extends PureComponent<*, *> {
  state = {
    selected: this.props.defaultSelected,
  };
  getTarget = () => {
    const { components: C, isSelected } = this.props;
    const { selected } = this.state;

    return (
      <C.ContainerHeader
        before={SwitcherBefore}
        after={ChevronDown}
        text={selected.text}
        subText={selected.subText}
        isSelected={isSelected}
      />
    );
  };
  onSwitch = selected => {
    const { location, history } = this.props;
    if (selected.pathname === location.pathname) return;
    history.push(selected.pathname);
    this.setState({ selected });
  };
  render() {
    const { components: C, options } = this.props;
    const { selected } = this.state;
    return (
      <div css={{ paddingBottom: `${gridSize}px` }}>
        <C.Switcher
          onChange={this.onSwitch}
          create={{
            onClick: () => {
              // eslint-disable-next-line
              const boardName = window.prompt(
                'What would you like to call your new board?',
              );
              if (boardName && boardName.length)
                console.log(`You created the board "${boardName}"`);
            },
            text: 'Create board',
          }}
          options={options}
          isMulti={false}
          hideSelectedOptions
          target={this.getTarget()}
          value={selected}
        />
      </div>
    );
  }
}
export const ProjectSwitcher = withRouter(Switcher);
