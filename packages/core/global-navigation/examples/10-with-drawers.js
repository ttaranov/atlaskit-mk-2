// @flow

import React from 'react';
import AtlaskitAnalyticsListeners from '@atlaskit/analytics-listeners';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';
import type { DrawerContentProps } from '../src/components/GlobalNavigation/types';
import mockAnalyticsWebClient from './shared/mock-analytics-client';

const generateDrawer = drawerContent => ({
  closeDrawer,
}: DrawerContentProps) => (
  <div style={{ paddingTop: 80 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
      }}
    >
      {`${drawerContent} Drawer`}
    </div>
    <button onClick={closeDrawer}>Close</button>
  </div>
);

const Global = () => (
  <GlobalNavigation
    product={{
      label: 'Jira',
      icon: JiraIcon,
    }}
    create={{
      drawer: {
        content: generateDrawer('Create'),
      },
    }}
    search={{
      drawer: {
        content: generateDrawer('Search'),
      },
    }}
    notification={{
      drawer: {
        content: generateDrawer('Notification'),
      },
    }}
    people={{
      drawer: {
        content: generateDrawer('People'),
      },
    }}
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
