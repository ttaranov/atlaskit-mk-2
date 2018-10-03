// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    fabricNotificationLogUrl="https://product-fabric.atlassian.net/gateway/api/notification-log/"
    cloudId="DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b"
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
