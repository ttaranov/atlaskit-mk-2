// @flow

import type { ComponentType } from 'react';

export type ProductNavProps = {
  container: ComponentType<{}>,
  isHinting: boolean,
  isPeeking: boolean,
  onOverlayClick?: Event => void,
  resizeState: Object,
  root: ComponentType<{}>,
  transitionState: 'entered' | 'entering' | 'exited' | 'exiting',
};
