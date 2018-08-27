// @flow
import type { ComponentType } from 'react';

export type DrawerName = 'search' | 'notification' | 'starred' | 'create';

export type GlobalDrawerProps = {
  isCreateDrawerOpen?: boolean,
  createDrawerContents?: ComponentType<*>,
  onCreateDrawerOpen?: () => void,
  onCreateDrawerClose?: () => void,

  isSearchDrawerOpen?: boolean,
  searchDrawerContents?: ComponentType<*>,
  onSearchDrawerOpen?: () => void,
  onSearchDrawerClose?: () => void,

  isNotificationDrawerOpen?: boolean,
  notificationDrawerContents?: ComponentType<*>,
  onNotificationDrawerOpen?: () => void,
  onNotificationDrawerClose?: () => void,

  isStarredDrawerOpen?: boolean,
  starredDrawerContents?: ComponentType<*>,
  onStarredDrawerOpen?: () => void,
  onStarredDrawerClose?: () => void,
};

export type GlobalDrawerState = {
  [any]: boolean, // Need an indexer property to appease flow for is${capitalisedDrawerName}Open
  isSearchDrawerOpen: boolean,
  isNotificationDrawerOpen: boolean,
  isStarredDrawerOpen: boolean,
};
