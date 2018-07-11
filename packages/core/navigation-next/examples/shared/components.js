// @flow

import React from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import LinkIcon from '@atlaskit/icon/glyph/link';

import {
  GlobalNav,
  ItemAvatar,
  ViewRenderer,
  ViewStateSubscriber,
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

export const ProjectSwitcher = ({ components: C, ...props }: *) => (
  <div css={{ paddingBottom: `${gridSize}px` }}>
    <C.ContainerHeader
      before={itemState => (
        <ItemAvatar itemState={itemState} appearance="square" />
      )}
      {...props}
    />
  </div>
);

const Renderer = ({ items }: *) => {
  return items ? (
    <div css={{ padding: `${gridSize * 2}px 0` }}>
      <ViewRenderer
        customComponents={{ JiraWordmark, LinkItem, ProjectSwitcher }}
        items={items}
      />
    </div>
  ) : (
    'LOADING'
  );
};

export const ProductRoot = () => (
  <ViewStateSubscriber>
    {({ state }) => <Renderer items={state.productViewData} />}
  </ViewStateSubscriber>
);

export const ProductContainer = () => (
  <ViewStateSubscriber>
    {({ state: { containerViewData } }) => (
      <Renderer items={containerViewData} />
    )}
  </ViewStateSubscriber>
);
