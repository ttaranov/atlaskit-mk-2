// @flow

import React from 'react';
import type { NavigationStateInterface } from '@atlaskit/navigation-next';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import Avatar from '@atlaskit/avatar';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import PeopleIcon from '@atlaskit/icon/glyph/people';

const defaultConfig = (navigation: NavigationStateInterface) => ({
  product: {
    position: 0,
  },
  search: {
    icon: SearchIcon,
    label: 'Search',
    onClick: navigation.openSearchDrawer,
    position: 1,
    tooltip: 'Search',
  },
  create: {
    icon: CreateIcon,
    label: 'Create',
    onClick: navigation.openCreateDrawer,
    position: 2,
    tooltip: 'Create',
  },
  notification: {
    icon: NotificationIcon,
    label: 'Notifications',
    onClick: navigation.openNotificationDrawer,
    tooltip: 'Notifications',
    position: 3,
  },
  people: {
    icon: PeopleIcon,
    label: 'People directory',
    onClick: navigation.openPeopleDrawer,
    tooltip: 'People directory',
    position: 4,
  },
  appSwitcher: {
    icon: MenuIcon,
    label: 'App Switcher',
    tooltip: 'App Switcher',
    position: 5,
  },
  help: {
    icon: QuestionIcon,
    label: 'Help',
    tooltip: 'Help',
    position: 6,
  },
  profile: {
    icon: () => (
      <Avatar
        borderColor="transparent"
        isActive={false}
        isHover={false}
        size="small"
      />
    ),
    label: 'Your profile and Settings',
    tooltip: 'Your profile and Settings',
    position: 7,
  },
});

export default defaultConfig;
