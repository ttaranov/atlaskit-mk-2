// @flow

import React from 'react';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';

import GlobalNavigation from '../src';

const ExampleDropdown = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem>Hello it with some really quite long text here.</DropdownItem>
    <DropdownItem>Some text 2</DropdownItem>
    <DropdownItem isDisabled>Some disabled text</DropdownItem>
    <DropdownItem>Some more text</DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      A link item
    </DropdownItem>
  </DropdownItemGroup>
);

const GlobalNav = () => (
  <GlobalNavigation
    helpItems={ExampleDropdown}
    profileItems={ExampleDropdown}
    profileIconUrl="https://api.adorable.io/avatars/285/abott@adorable.png"
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
    <LayoutManager
      globalNavigation={GlobalNav}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      Page content
    </LayoutManager>
  </NavigationProvider>
);
