// @flow

import type { ComponentType } from 'react';

export type DrawerContentProps = { closeDrawer: () => void };

export type InitialNavigationStateShape = {
  activeDrawer?: string | null,
  isHinting?: boolean,
  isPeeking?: boolean,
  productNavIsCollapsed?: boolean,
  productNavWidth?: number,
};

export type NavigationStateShape = InitialNavigationStateShape & {
  isResizing?: boolean,
};

export type GlobalNavDrawerProps = {
  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isCreateDrawerOpen?: boolean,
  /** The contents of the create drawer. This is ignored if onCreateClick is
   * passed. */
  createDrawerContents?: ComponentType<*>,
  /** A callback function which will be fired when the create drawer is opened.
   * */
  onCreateDrawerOpen?: () => void,
  /** A callback function which will be fired when the create drawer is closed.
   * */
  onCreateDrawerClose?: () => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldCreateDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isSearchDrawerOpen?: boolean,
  /** The contents of the search drawer. This is ignored if onSearchClick is
   * passed. */
  searchDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the search drawer is opened.
   * */
  onSearchDrawerOpen?: () => void,
  /** A callback function which will be called when the search drawer is closed.
   * */
  onSearchDrawerClose?: () => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldSearchDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isNotificationDrawerOpen?: boolean,
  /** The contents of the notifications drawer. */
  notificationDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the notifications drawer is
   * opened. */
  onNotificationDrawerOpen?: () => void,
  /** A callback function which will be called when the notifications drawer is
   * closed. */
  onNotificationDrawerClose?: () => void,

  /** Locale to be passed to the notification iFrame */
  locale?: string,
  /** Prop to let notification iframe know which product it's being rendered in*/
  product?: 'jira' | 'confluence',
  /** fabricNotificationLogUrl of the user */
  fabricNotificationLogUrl?: string,
  /** cloudId of the user */
  cloudId?: string,

  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldNotificationDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isStarredDrawerOpen?: boolean,
  /** The contents of the starred drawer. */
  starredDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the starred drawer is
   * opened. */
  onStarredDrawerOpen?: () => void,
  /** A callback function which will be called when the starred drawer is
   * closed. */
  onStarredDrawerClose?: () => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldStarredDrawerUnmountOnExit?: boolean,
};

export type GlobalNavigationProps = {
  /** The product logo. Expected to be an Atlaskit Logo component. */
  productIcon?: ComponentType<{}>,
  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onProductClick?: () => void,
  /** The text to display in the tooltip for the product logo item. */
  productTooltip?: string,
  /** An href attribute for the product logo item. */
  productHref?: string,

  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onCreateClick?: ?() => void,
  /** The text to display in the tooltip for the create item. */
  createTooltip?: string,

  /** A callback function which will be called when the starred item is clicked.
   * */
  onStarredClick?: ?() => void,
  /** The text to display in the tooltip for the starred item. */
  starredTooltip?: string,

  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onSearchClick?: ?() => void,
  /** The text to display in the tooltip for the search item. */
  searchTooltip?: string,

  /** The component to render the app switcher. */
  appSwitcherComponent?: ComponentType<*>, // AppSwitcher component
  /** The text to display in the tooltip for the app switcher item. */
  appSwitcherTooltip?: string,

  /** The text to display in the tooltip for the help item. */
  helpTooltip?: string,
  /** A component to render into the help menu dropdown. */
  helpItems?: ComponentType<{}>,

  /** The text to display in the tooltip for the profile item. */
  profileTooltip?: string,
  /** A component to render into the profile menu dropdown. */
  profileItems?: ComponentType<{}>,
  /** The URL of the avatar image to render in the profile item. */
  profileIconUrl?: string,
  /** The URL to redirect anonymous users to. */
  loginHref?: string,

  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onNotificationClick?: ?() => void,
  /** The number of unread notifications. Will render as a badge above the
   * notifications item. */
  notificationCount?: number,
  /** The text to display in the tooltip for the notifications item. */
  notificationTooltip?: string,
} & GlobalNavDrawerProps;

export type DrawerName = 'search' | 'notification' | 'starred' | 'create';
