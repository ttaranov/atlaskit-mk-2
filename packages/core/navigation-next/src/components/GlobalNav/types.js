// @flow

import type { Node } from 'react';

import type { GlobalItemProps } from '../GlobalItem/types';
import type { GlobalTheme } from '../../theme/types';

export type ItemDataShape = GlobalItemProps & { key?: string };

export type GlobalNavProps = {
  children: Node,
  primaryActions: Array<ItemDataShape>,
  secondaryActions: Array<ItemDataShape>,
  theme: GlobalTheme,
};
