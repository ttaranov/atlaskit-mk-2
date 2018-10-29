// @flow

import type { ElementConfig } from 'react';
import Item from '../Item';

export type SortableItemProps = {
  ...ElementConfig<typeof Item>,
  /** The index of the sortable item within it's group, used for sorting. */
  index: number,
  /** A unique identifier to identify what item it is, used for both sorting
   *  and analytics */
  id: string,
};
