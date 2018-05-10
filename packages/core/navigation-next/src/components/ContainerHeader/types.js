// @flow

import type { ItemProps } from '../Item/types';

// ContainerHeader passes most of its props through to an underlying Item. There
// are a couple of props which it doesn't use.
type ExcludedProps = {
  spacing: *, // ContainerHeader doesn't have spacing options
};
export type ContainerHeaderProps = $Diff<ItemProps, ExcludedProps>;
