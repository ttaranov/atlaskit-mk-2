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
      section: 'primary',
      rank: 1,
      tooltip: 'Atlassian',
    },
    yourWork: {
      icon: TrayIcon,
      label: 'Your Work',
      section: 'primary',
      rank: 2,
      tooltip: 'Your Work',
    },
    search: {
      icon: SearchIcon,
      label: 'Search',
      section: 'primary',
      rank: 3,
      tooltip: 'Search',
    },
    create: {
      icon: CreateIcon,
      label: 'Create',
      section: 'primary',
      rank: 4,
      tooltip: 'Create',
    },
    notification: {
      icon: NotificationIcon,
      label: 'Notifications',
      section: 'secondary',
      rank: 1,
      tooltip: 'Notifications',
    },
    people: {
      icon: PeopleIcon,
      label: 'People directory',
      section: 'secondary',
      rank: 2,
      tooltip: 'People directory',
    },
    appSwitcher: {
      label: 'App Switcher',
      section: 'secondary',
      rank: 3,
      tooltip: 'App Switcher',
    },
    help: {
      label: 'Help',
      section: 'secondary',
      rank: 4,
      tooltip: 'Help',
    },
    profile: {
      label: 'Your profile and Settings',
      section: 'secondary',
      rank: 5,
      tooltip: 'Your profile and Settings',
    },
  };
}
