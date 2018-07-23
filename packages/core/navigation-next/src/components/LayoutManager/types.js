// @flow

import type { ComponentType, Node } from 'react';

import UIController from '../../ui-controller/UIController';

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
  navigationUIController: UIController,
};
