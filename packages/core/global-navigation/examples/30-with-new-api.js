// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';
import Lorem from 'react-lorem-component';

import GlobalNavigation from '../src/components/GlobalNavigation';

const Global = () => (
  <GlobalNavigation
    product={{
      label: 'Jira',
      icon: EmojiAtlassianIcon,
    }}
    search={{
      triggerType: 'drawer',
      triggerContent: () => <div>Drawer content for search</div>,
    }}
    create={{
      triggerType: 'modal',
      triggerContent: () => <Lorem count={3} />,
    }}
    people={{}}
    notification={{}}
    appSwitcher={{}}
    help={{
      triggerType: 'dropdown',
      triggerContent: () => (
        <DropdownItemGroup title="Heading">
          <DropdownItem>
            Hello it with some really quite long text here.
          </DropdownItem>
          <DropdownItem>Some text 2</DropdownItem>
          <DropdownItem isDisabled>Some disabled text</DropdownItem>
          <DropdownItem>Some more text</DropdownItem>
          <DropdownItem href="//atlassian.com" target="_new">
            A link item
          </DropdownItem>
        </DropdownItemGroup>
      ),
    }}
    profile={{}}
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
