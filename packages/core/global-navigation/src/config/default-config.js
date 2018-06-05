// @flow

import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import PeopleIcon from '@atlaskit/icon/glyph/people';

export default function generateDefaultConfig() {
  return {
    product: {
      label: 'Atlassian',
      section: 'top',
      rank: 1,
      tooltip: 'Atlassian',
    },
    yourWork: {
      icon: TrayIcon,
      label: 'Your Work',
      section: 'top',
      rank: 2,
      tooltip: 'Your Work',
    },
    search: {
      icon: SearchIcon,
      label: 'Search',
      section: 'top',
      rank: 3,
      tooltip: 'Search',
    },
    create: {
      icon: CreateIcon,
      label: 'Create',
      section: 'top',
      rank: 4,
      tooltip: 'Create',
    },
    notification: {
      icon: NotificationIcon,
      label: 'Notifications',
      section: 'bottom',
      rank: 1,
      tooltip: 'Notifications',
    },
    people: {
      icon: PeopleIcon,
      label: 'People directory',
      section: 'bottom',
      rank: 2,
      tooltip: 'People directory',
    },
    appSwitcher: {
      label: 'App Switcher',
      section: 'bottom',
      rank: 3,
      tooltip: 'App Switcher',
    },
    help: {
      label: 'Help',
      section: 'bottom',
      rank: 4,
      tooltip: 'Help',
    },
    profile: {
      label: 'Your profile and Settings',
      section: 'bottom',
      rank: 5,
      tooltip: 'Your profile and Settings',
    },
  };
}
