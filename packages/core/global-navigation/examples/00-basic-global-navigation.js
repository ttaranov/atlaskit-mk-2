// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src/components/GlobalNavigation';

const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    onCreateClick={() => console.log('create clicked')}
    onSearchClick={() => console.log('search clicked')}
    onYourWorkClick={() => console.log('your work clicked')}
    onNotificationClick={() => console.log('notification clicked')}
    onPeopleClick={() => console.log('People clicked')}
    onProfileClick={() => console.log('Profile clicked')}
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
