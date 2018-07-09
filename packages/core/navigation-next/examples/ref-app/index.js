// @flow

import React, { Fragment } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import { AtlassianWordmark } from '@atlaskit/logo';
import {
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
  NavRenderer,
  RootViewSubscriber,
} from '../../src';

import RootViews from './views/root';

const MyGlobalNavigation = () => (
  <NavigationSubscriber>
    {({ togglePeek }) => (
      <GlobalNavigation
        productIcon={AtlassianIcon}
        onProductClick={togglePeek}
      />
    )}
  </NavigationSubscriber>
);

const ProductNavigationWrapper = props => (
  <div style={{ padding: 16 }} {...props} />
);

const Wordmark = () => (
  <div style={{ padding: '8px 0' }}>
    <AtlassianWordmark />
  </div>
);

const MyProductNavigation = () => (
  <ProductNavigationWrapper>
    <RootViewSubscriber>
      {({ state: { data } }) =>
        data ? (
          <NavRenderer items={data} customComponents={{ Wordmark }} />
        ) : (
          'LOADING'
        )
      }
    </RootViewSubscriber>
  </ProductNavigationWrapper>
);

export default () => (
  <NavigationProvider>
    <Fragment>
      <RootViews />
      <LayoutManager
        globalNavigation={MyGlobalNavigation}
        productRootNavigation={MyProductNavigation}
        productContainerNavigation={null}
      >
        <div>Hello world</div>
      </LayoutManager>
    </Fragment>
  </NavigationProvider>
);
