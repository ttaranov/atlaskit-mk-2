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
  /** Whether the create drawer is open */
  isCreateDrawerOpen?: boolean,
  /** The contents of the create drawer */
  createDrawerContents?: ComponentType<*>,
  /** A callback function which will be fired when the create drawer is opened
   * */
  onCreateDrawerOpen?: () => void,
  /** A callback function which will be fired when the create drawer is closed
   * */
  onCreateDrawerClose?: () => void,
  shouldCreateDrawerUnmountOnExit?: boolean,

  /** Whether the search drawer is open */
  isSearchDrawerOpen?: boolean,
  /** The contents of the search drawer */
  searchDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the search drawer is opened
   * */
  onSearchDrawerOpen?: () => void,
  /** A callback function which will be called when the search drawer is closed
   * */
  onSearchDrawerClose?: () => void,
  shouldSearchDrawerUnmountOnExit?: boolean,

  /** Whether the notifications drawer is open */
  isNotificationDrawerOpen?: boolean,
  /** The contents of the notifications drawer */
  notificationDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the notifications drawer is
   * opened */
  onNotificationDrawerOpen?: () => void,
  /** A callback function which will be called when the notifications drawer is
   * closed */
  onNotificationDrawerClose?: () => void,
  shouldNotificationDrawerUnmountOnExit?: boolean,

  /** Whether the starred drawer is open */
  isStarredDrawerOpen?: boolean,
  /** The contents of the starred drawer */
  starredDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the starred drawer is opened
   * */
  onStarredDrawerOpen?: () => void,
  /** A callback function which will be called when the starred drawer is closed
   * */
  onStarredDrawerClose?: () => void,
  shouldStarredDrawerUnmountOnExit?: boolean,
};

export type GlobalNavigationProps = {
  /** The product logo. Expected to be an Atlaskit Logo component. */
  productIcon?: ComponentType<{}>,
  /** A callback function which will be called when the product logo item is
   * clicked. */
  onProductClick?: () => void,
  /** The text to display in the tooltip for the product logo item. */
  productTooltip?: string,
  /** An href attribute for the product logo item. */
  productHref?: string,

  /** A callback function which will be called when the create item is clicked.
   * */
  onCreateClick?: ?() => void,
  /** The text to display in the tooltip for the create item. */
  createTooltip?: string,

  /** A callback function which will be called when the starred item is clicked.
   * */
  onStarredClick?: ?() => void,
  /** The text to display in the tooltip for the starred item. */
  starredTooltip?: string,

  /** A callback function which will be called when the search item is clicked.
   * */
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

  /** A callback function which will be called when the starred item is clicked.
   * */
  onNotificationClick?: ?() => void,
  /** The number of unread notifications. Will render as a badge above the
   * notifications item. */
  notificationCount?: number,
  /** The text to display in the tooltip for the notifications item. */
  notificationTooltip?: string,
} & GlobalNavDrawerProps;

export type DrawerName = 'search' | 'notification' | 'starred' | 'create';
