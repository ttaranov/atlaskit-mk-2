// @flow

import type { ComponentType, Node } from 'react';

export type LayoutManagerProps = {
  children: Node,
  defaultDrawerIcon: ComponentType<*>,
  navigation: Object,
  globalNavigation: ComponentType<*>,
  productRootNavigation: ComponentType<{}>,
  productContainerNavigation: ComponentType<{}>,
};

export type DrawerGatewayProps = { innerRef: (?HTMLElement) => void };
