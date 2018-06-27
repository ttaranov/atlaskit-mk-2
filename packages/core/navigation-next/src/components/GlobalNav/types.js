// @flow

import type { GlobalItemProps } from '../GlobalItem/types';
import type { GlobalTheme } from '../../theme/types';

type ItemDataShape = GlobalItemProps & { key?: string };

export type GlobalNavProps = {
  /** An array of objects to render as GlobalItems at the top of the GlobalNav
   * bar. */
  primaryItems: Array<ItemDataShape>,
  /** An array of objects to render as GlobalItems at the bottom of the
   * GlobalNav bar. */
  secondaryItems: Array<ItemDataShape>,
};

export type GlobalNavPrimitiveProps = GlobalNavProps & {
  theme: GlobalTheme,
};
