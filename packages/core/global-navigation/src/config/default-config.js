// @flow

import React from 'react';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import Avatar from '@atlaskit/avatar';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import PeopleIcon from '@atlaskit/icon/glyph/people';

export default function generateDefaultConfig() {
  return {
    product: {
      position: 1,
    },
    yourWork: {
      icon: TrayIcon,
      position: 2,
      tooltip: 'Your Work',
      label: 'Your Work',
    },
    search: {
      icon: SearchIcon,
      label: 'Search',
      position: 3,
      tooltip: 'Search',
    },
    create: {
      icon: CreateIcon,
      label: 'Create',
      position: 4,
      tooltip: 'Create',
    },
    notification: {
      icon: NotificationIcon,
      label: 'Notifications',
      tooltip: 'Notifications',
      position: 5,
    },
    people: {
      icon: PeopleIcon,
      label: 'People directory',
      tooltip: 'People directory',
      position: 6,
    },
    appSwitcher: {
      label: 'App Switcher',
      tooltip: 'App Switcher',
      position: 7,
    },
    help: {
      label: 'Help',
      tooltip: 'Help',
      position: 8,
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
      position: 9,
    },
  };
}
