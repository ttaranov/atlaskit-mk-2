// @flow

import type { ComponentType, Node } from 'react';

export type DrawerWrapperProps = { width: 'full' | 'narrow' | 'wide' };

export type DrawerProps = DrawerWrapperProps & {
  children: Node,
  icon: ComponentType<*>,
  onClose?: any => void,
  onKeyDown?: (SyntheticKeyboardEvent<*>) => void,
  navigation: Object,
};
