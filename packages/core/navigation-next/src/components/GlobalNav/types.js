// @flow

import type { GlobalItemProps } from '../GlobalItem/types';
import type { GlobalTheme } from '../../theme/types';

type ItemDataShape = GlobalItemProps & { key?: string };

export type ConnectedGlobalNavigationProps = {
  /** An array of objects to render as GlobalItems at the top of the GlobalNavigation
   * bar.
   * Note: The `key` prop is deprecated, the `id` prop should be used instead. */
  primaryItems: ItemDataShape[],
  /** An array of objects to render as GlobalItems at the bottom of the
   * GlobalNavigation bar.
   * Note: The `key` prop is deprecated, the `id` prop should be used instead. */
  secondaryItems: ItemDataShape[],
};

export type GlobalNavigationProps = GlobalNavigationProps & {
  theme: GlobalTheme,
};
