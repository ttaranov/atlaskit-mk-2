// @flow

import React from 'react';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
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

const mockClient = {
  sendUIEvent: console.log,
  sendOperationalEvent: console.log,
  sendTrackEvent: console.log,
  sendScreenEvent: console.log,
};

export default () => (
  <NavigationProvider>
    <FabricAnalyticsListeners client={Promise.resolve(mockClient)}>
      <LayoutManager
        globalNavigation={Global}
        productNavigation={() => null}
        containerNavigation={() => null}
      >
        Page content
      </LayoutManager>
    </FabricAnalyticsListeners>
  </NavigationProvider>
);
