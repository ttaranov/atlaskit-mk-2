// @flow

import type { ComponentType, Node } from 'react';

import UIController from '../../ui-controller/UIController';

export type CollapseListener = number => void;

export type CollapseToggleTooltipContent = (
  isCollapsed: boolean,
) => { text: string, char: string } | null;

export type CollapseListeners = {
  /** Called when the navigation begins expanding. */
  onExpandStart?: CollapseListener,
  /** Called when the navigation completes expanding. */
  onExpandEnd?: CollapseListener,
  /** Called when the navigation begins collapsing. */
  onCollapseStart?: CollapseListener,
  /** Called when the navigation completes collapsing. */
  onCollapseEnd?: CollapseListener,
};

export type ConnectedLayoutManagerProps = {
  /** Your page content. */
  children: Node,
  /** A component which will render the container navigation layer. */
  containerNavigation: ?ComponentType<{}>,
  /** A component which will render the global navigation bar. */
  globalNavigation: ComponentType<{}>,
  /** A component which will render the product navigation layer. */
  productNavigation: ComponentType<{}>,
  /** Displayed when the user's mouse is over the collapse/expand toggle. */
  collapseToggleTooltipContent?: CollapseToggleTooltipContent,
  /** Listeners for collapsing and expanding navigation bar. */
  ...CollapseListeners,
};

export type LayoutManagerProps = ConnectedLayoutManagerProps & {
  navigationUIController: UIController,
};
