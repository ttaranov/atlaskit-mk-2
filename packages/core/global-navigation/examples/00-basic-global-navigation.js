// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import MenuIcon from '@atlaskit/icon/glyph/menu';

import GlobalNavigation from '../src';

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    onCreateClick={() => console.log('create clicked')}
    onSearchClick={() => console.log('search clicked')}
    onYourWorkClick={() => console.log('your work clicked')}
    onNotificationClick={() => console.log('notification clicked')}
    onPeopleClick={() => console.log('People clicked')}
    appSwitcherComponent={({ className }) => (
      <button className={className}>
        <MenuIcon onClick={() => console.log('AppSwitcher clicked')} />
      </button>
    )}
    loginHref="#login"
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
