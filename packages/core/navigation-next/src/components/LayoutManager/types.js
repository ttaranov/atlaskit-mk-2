// @flow

import type { ComponentType, Node } from 'react';

export type WrappedLayoutManagerProps = {
  children: Node,
  defaultDrawerIcon?: ComponentType<*>,
  globalNavigation: ComponentType<*>,
  productRootNavigation: ComponentType<{}>,
  productContainerNavigation: ComponentType<{}>,
};

export type LayoutManagerProps = WrappedLayoutManagerProps & {
  // flowlint-next-line unclear-type:off
  navigation: Object,
};

export type DrawerGatewayProps = { innerRef: (?HTMLElement) => void };
