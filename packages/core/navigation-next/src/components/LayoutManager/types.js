// @flow

import type { ComponentType, Node } from 'react';

export type WrappedLayoutManagerProps = {
  children: Node,
  globalNavigation: ComponentType<*>,
  productRootNavigation: ComponentType<{}>,
  productContainerNavigation: ?ComponentType<{}>,
};

export type LayoutManagerProps = WrappedLayoutManagerProps & {
  navigation: Object,
};
