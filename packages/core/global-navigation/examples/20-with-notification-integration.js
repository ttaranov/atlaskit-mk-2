// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';

const fabricNotificationLogUrl = '/gateway/api/notification-log/';
const cloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    fabricNotificationLogUrl={fabricNotificationLogUrl}
    cloudId={cloudId}
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);
