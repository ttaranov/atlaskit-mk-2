// @flow

import React from 'react';
import { LayoutManager, NavigationProvider } from '../src';

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={() => null}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
