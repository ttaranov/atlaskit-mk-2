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
      label: 'Atlassian',
      position: 'top1',
      tooltip: 'Atlassian',
    },
    yourWork: {
      icon: TrayIcon,
      label: 'Your Work',
      position: 'top2',
      tooltip: 'Your Work',
    },
    search: {
      icon: SearchIcon,
      label: 'Search',
      position: 'top3',
      tooltip: 'Search',
    },
    create: {
      icon: CreateIcon,
      label: 'Create',
      position: 'top4',
      tooltip: 'Create',
    },
    notification: {
      icon: NotificationIcon,
      label: 'Notifications',
      position: 'bottom1',
      tooltip: 'Notifications',
    },
    people: {
      icon: PeopleIcon,
      label: 'People directory',
      position: 'bottom2',
      tooltip: 'People directory',
    },
    appSwitcher: {
      label: 'App Switcher',
      position: 'bottom3',
      tooltip: 'App Switcher',
    },
    help: {
      label: 'Help',
      position: 'bottom4',
      tooltip: 'Help',
    },
    profile: {
      label: 'Your profile and Settings',
      position: 'bottom5',
      tooltip: 'Your profile and Settings',
    },
  };
}
