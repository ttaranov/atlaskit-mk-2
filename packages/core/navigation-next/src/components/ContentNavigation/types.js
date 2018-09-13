// @flow

import type { ComponentType } from 'react';

export type ContentNavigationProps = {
  container?: ?ComponentType<{}>,
  isDragging: boolean,
  isPeekHinting: boolean,
  isPeeking: boolean,
  isVisible: boolean,
  product: ComponentType<{}>,
  transitionState: 'entered' | 'entering' | 'exited' | 'exiting',
  width: number,
};
