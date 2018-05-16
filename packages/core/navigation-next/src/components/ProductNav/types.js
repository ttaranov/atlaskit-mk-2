// @flow

import type { ComponentType } from 'react';

export type ProductNavProps = {
  container?: ?ComponentType<{}>,
  isDragging: boolean,
  isHinting: boolean,
  isPeeking: boolean,
  onOverlayClick?: Event => void,
  root: ComponentType<{}>,
  transitionState: 'entered' | 'entering' | 'exited' | 'exiting',
  width: number,
};
