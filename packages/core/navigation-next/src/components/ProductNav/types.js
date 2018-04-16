// @flow

import type { ComponentType } from 'react';

export type ProductNavProps = {
  container: ComponentType<{}>,
  isPeeking: boolean,
  onOverlayClick?: Event => void,
  root: ComponentType<{}>,
};
