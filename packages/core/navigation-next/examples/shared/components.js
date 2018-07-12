// @flow

import React, { PureComponent } from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { Link, Route, withRouter } from 'react-router-dom';
import LinkIcon from '@atlaskit/icon/glyph/link';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';

import {
  GlobalNav,
  ContainerViewSubscriber,
  ItemAvatar,
  RootViewSubscriber,
  NavRenderer,
} from '../../src';
import { globalNavPrimaryItems, globalNavSecondaryItems } from './mock-data';

const gridSize = gridSizeFn();

export const DefaultGlobalNavigation = () => (
  <GlobalNav
    primaryItems={globalNavPrimaryItems}
    secondaryItems={globalNavSecondaryItems}
  />
);

export const JiraWordmark = () => (
  <div css={{ padding: `${gridSize * 2}px 0` }}>
    <JiraWordmarkLogo />
  </div>
);

export const LinkItem = ({ components: C, to, ...props }: *) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <C.Item
          after={() => <LinkIcon size="small" />}
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};

// ==============================
// Project Switcher
// ==============================

class Switcher extends PureComponent<*, *> {
  state = {
    selected: this.props.defaultSelected,
  };
  getTarget = () => {
    const { components: C, isSelected } = this.props;
    const { selected } = this.state;

    return (
      <C.ContainerHeader
        before={itemState => (
          <ItemAvatar itemState={itemState} appearance="square" />
        )}
        after={itemState => <ChevronDown itemState={itemState} />}
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

// ==============================
// Renderers
// ==============================

const ViewRenderer = ({ view }: *) => {
  const { activeView, data } = view.state;
  return activeView && data ? (
    <div css={{ padding: `${gridSize * 2}px 0` }}>
      <NavRenderer
        customComponents={{ JiraWordmark, LinkItem, ProjectSwitcher }}
        items={data}
      />
    </div>
  ) : (
    'LOADING'
  );
};

export const ProductRoot = () => (
  <RootViewSubscriber>
    {rootView => <ViewRenderer view={rootView} />}
  </RootViewSubscriber>
);

export const ProductContainer = () => (
  <ContainerViewSubscriber>
    {containerView => <ViewRenderer view={containerView} />}
  </ContainerViewSubscriber>
);
