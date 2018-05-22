// @flow

import React from 'react';

import AtlaskitAnalyticsListeners from '@atlaskit/analytics-listeners';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src/components/GlobalNavigation';

import mockAnalyticsWebClient from './shared/mock-analytics-client';

const Global = () => (
  <GlobalNavigation
    product={{
      label: 'Jira',
      icon: EmojiAtlassianIcon,
    }}
    search={{}}
    create={{}}
    people={{}}
    notification={{}}
    appSwitcher={{}}
    help={{}}
    profile={{}}
  />
);

export default () => (
  <AtlaskitAnalyticsListeners client={mockAnalyticsWebClient}>
    <NavigationProvider>
      <LayoutManager
        globalNavigation={Global}
        productRootNavigation={() => null}
        productContainerNavigation={() => null}
      >
        Page content
      </LayoutManager>
    </NavigationProvider>
  </AtlaskitAnalyticsListeners>
);
