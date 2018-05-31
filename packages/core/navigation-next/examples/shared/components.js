// @flow

import React from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import LinkIcon from '@atlaskit/icon/glyph/link';

import {
  GlobalNav,
  ContainerViewSubscriber,
  ItemAvatar,
  RootViewSubscriber,
  NavRenderer,
} from '../../src';
import { globalNavPrimaryItems, globalNavSecondaryItems } from './mock-data';

const gridSize = gridSizeFn();

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

/**
 * Render components
 */
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
