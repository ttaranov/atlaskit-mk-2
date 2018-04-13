// @flow

import React from 'react';
import JiraIcon from '@atlaskit/icon/glyph/jira';

import { LayoutManager, NavigationProvider } from '../src';
import GlobalNavigation from '../src/opinionated-global-nav';
import type { DrawerContentProps } from '../src/opinionated-global-nav/components/GlobalNavigation/types';

const Global = () => (
  <GlobalNavigation
    product={{
      label: 'Jira',
      icon: JiraIcon,
    }}
    create={{
      drawer: {
        content: ({ closeDrawer }: DrawerContentProps) => (
          <div style={{ paddingTop: 80 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
              }}
            >
              Create Drawer
            </div>
            <button onClick={closeDrawer}>Close</button>
          </div>
        ),
      },
    }}
    search={{
      drawer: {
        content: ({ closeDrawer }: DrawerContentProps) => (
          <div style={{ paddingTop: 80 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
              }}
            >
              Search Drawer
            </div>
            <button onClick={closeDrawer}>Close</button>
          </div>
        ),
      },
    }}
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
