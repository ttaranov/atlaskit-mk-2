// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import {
  LayoutManager,
  GlobalItem,
  NavigationProvider,
  light,
} from '@atlaskit/navigation-next';
import Dropdown, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import Avatar from '@atlaskit/avatar';

import GlobalNavigation from '../src/components/GlobalNavigation';
import { withTheme } from '../src/theme';

const generateDropDown = Trigger => ({ className }) => (
  <Dropdown
    /* The trigger needs to be wrapped in a span so that it can accept the styling class */
    trigger={
      <span className={className}>
        <Trigger />
      </span>
    }
    position="right bottom"
    boundariesElement="window"
  >
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
  </Dropdown>
);

const Global = () => (
  <GlobalNavigation
    product={{
      label: 'Jira',
      icon: EmojiAtlassianIcon,
    }}
    appSwitcher={{
      component: generateDropDown(MenuIcon),
    }}
    help={{
      component: generateDropDown(() => <QuestionCircleIcon />),
    }}
    profile={{
      component: generateDropDown(() => (
        <Avatar
          borderColor="transparent"
          isActive={false}
          isHover={false}
          size="small"
        />
      )),
    }}
  />
);

const GlobalNav = () => (
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

export default withTheme({ mode: light, context: 'expanded' })(GlobalNav);
