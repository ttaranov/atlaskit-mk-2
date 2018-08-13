// @flow

import type { GlobalItemProps } from '../GlobalItem/types';
import type { GlobalTheme } from '../../theme/types';

type ItemDataShape = GlobalItemProps;

export type ConnectedGlobalNavigationProps = {
  /** An array of objects to render as GlobalItems at the top of the GlobalNavigation
   * bar. */
  primaryItems: ItemDataShape[],
  /** An array of objects to render as GlobalItems at the bottom of the
   * GlobalNavigation bar. */
  secondaryItems: ItemDataShape[],
};

export type GlobalNavigationProps = GlobalNavigationProps & {
  theme: GlobalTheme,
};
