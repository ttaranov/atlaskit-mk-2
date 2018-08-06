// @flow

import React, { Component } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import { LayoutManagerWithViewController, NavigationProvider } from '../src';

const MyGlobalNavigation = () => (
  <GlobalNavigation productIcon={AtlassianIcon} onProductClick={() => {}} />
);

export default class App extends Component<{}> {
  render() {
    return (
      <NavigationProvider>
        <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
          <div>Page content goes here.</div>
        </LayoutManagerWithViewController>
      </NavigationProvider>
    );
  }
}
