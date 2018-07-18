// @flow

import type { ComponentType, Node } from 'react';

import { UIState } from '../../';

export type LayoutManagerProps = {
  children: Node,
  containerNavigation: ?ComponentType<{}>,
  globalNavigation: ComponentType<{}>,
  navigationUI: UIState,
  productNavigation: ComponentType<{}>,
};
