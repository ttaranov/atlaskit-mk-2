// @flow

import type { ComponentType } from 'react';

export type ProductNavProps = {
  container: ComponentType<{}>,
  isHinting: boolean,
  isPeeking: boolean,
  onOverlayClick?: Event => void,
  // flowlint-next-line unclear-type:off
  resizeState: Object,
  root: ComponentType<{}>,
  transitionState: 'entered' | 'entering' | 'exited' | 'exiting',
};
