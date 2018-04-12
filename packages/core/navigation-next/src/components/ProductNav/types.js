// @flow

import type { ComponentType } from 'react';

export type ProductNavProps = {
  container: ComponentType<{}>,
  isPeeking: boolean,
  isResizing: boolean,
  onOverlayClick?: Event => void,
  root: ComponentType<{}>,
};
