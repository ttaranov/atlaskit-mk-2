// @flow

import type { Node } from 'react';

import type { GlobalItemProps } from '../GlobalItem/types';
import type { Theme } from '../../theme/types';

export type ItemDataShape = GlobalItemProps & { key?: string };

export type GlobalNavProps = {
  children: Node,
  primaryItems: Array<ItemDataShape>,
  secondaryItems: Array<ItemDataShape>,
  theme: Theme,
};
