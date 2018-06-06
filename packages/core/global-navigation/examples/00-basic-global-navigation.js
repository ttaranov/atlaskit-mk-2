// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import MenuIcon from '@atlaskit/icon/glyph/menu';

import GlobalNavigation from '../src/components/GlobalNavigation';

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    onProductClick={() => console.log('product clicked')}
    onCreateClick={() => console.log('create clicked')}
    onSearchClick={() => console.log('search clicked')}
    onYourWorkClick={() => console.log('your work clicked')}
    onNotificationClick={() => console.log('notification clicked')}
    onPeopleClick={() => console.log('People clicked')}
    appSwitcherComponent={({ className }) => (
      <span className={className}>
        <MenuIcon />
      </span>
    )}
    loginHref="#loginUrl"
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productRootNavigation={() => null}
      productContainerNavigation={() => null}
    >
      Page content
    </LayoutManager>
  </NavigationProvider>
);
