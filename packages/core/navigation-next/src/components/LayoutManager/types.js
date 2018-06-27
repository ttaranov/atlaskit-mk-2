// @flow

import type { ComponentType, Node } from 'react';

export type WrappedLayoutManagerProps = {
  /** Your page content. */
  children: Node,
  /** A component which will render the global navigation bar. */
  globalNavigation: ComponentType<*>,
  /** A component which will render the product root navigation layer. */
  productRootNavigation: ComponentType<{}>,
  /** A component which will render the product container navigation layer. */
  productContainerNavigation: ?ComponentType<{}>,
};

export type LayoutManagerProps = WrappedLayoutManagerProps & {
  navigation: Object,
};
