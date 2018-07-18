// @flow

import type { ComponentType, Node } from 'react';

import UIState from '../../ui-state/UIState';

export type ConnectedLayoutManagerProps = {
  /** Your page content. */
  children: Node,
  /** A component which will render the container navigation layer. */
  containerNavigation: ?ComponentType<{}>,
  /** A component which will render the global navigation bar. */
  globalNavigation: ComponentType<{}>,
  /** A component which will render the product navigation layer. */
  productNavigation: ComponentType<{}>,
};

export type LayoutManagerProps = ConnectedLayoutManagerProps & {
  navigationUI: UIState,
};
