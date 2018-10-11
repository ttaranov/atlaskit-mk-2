// @flow

import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import StarLargeIcon from '@atlaskit/icon/glyph/star-large';
import NotificationIcon from '@atlaskit/icon/glyph/notification';

import type { DefaultConfigShape } from './types';

export default function generateDefaultConfig(): DefaultConfigShape {
  return {
    product: {
      label: 'Atlassian',
      rank: 1,
      section: 'primary',
      tooltip: 'Atlassian',
      id: 'productLogo',
    },
    starred: {
      icon: StarLargeIcon,
      label: 'Starred and recent',
      rank: 2,
      section: 'primary',
      tooltip: 'Starred and recent',
      id: 'starDrawer',
    },
    search: {
      icon: SearchIcon,
      label: 'Search',
      section: 'primary',
      rank: 3,
      tooltip: 'Search',
      id: 'quickSearch',
    },
    create: {
      icon: CreateIcon,
      label: 'Create',
      section: 'primary',
      rank: 4,
      tooltip: 'Create',
      id: 'create',
    },
    notification: {
      icon: NotificationIcon,
      label: 'Notifications',
      section: 'secondary',
      rank: 1,
      tooltip: 'Notifications',
      id: 'notifications',
    },
    appSwitcher: {
      section: 'secondary',
      rank: 2,
      id: 'appSwitcher',
    },
    help: {
      label: 'Help',
      section: 'secondary',
      rank: 3,
      tooltip: 'Help',
      id: 'help',
    },
    profile: {
      label: 'Your profile and Settings',
      section: 'secondary',
      rank: 4,
      tooltip: 'Your profile and Settings',
      id: 'profile',
    },
  };
}
