// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import GlobalNavigation from '../src';

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    onCreateClick={() => console.log('create clicked')}
    onSearchClick={() => console.log('search clicked')}
    onStarredClick={() => console.log('your work clicked')}
    onNotificationClick={() => console.log('notification clicked')}
    appSwitcherComponent={({ className }) => (
      <button className={className}>
        <AppSwitcherIcon onClick={() => console.log('AppSwitcher clicked')} />
      </button>
    )}
    loginHref="#login"
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      Page content
    </LayoutManager>
  </NavigationProvider>
);
