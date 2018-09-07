// @flow

import type { DraggableProps } from 'react-beautiful-dnd';
import type { ItemProps } from '../Item/types';

export type SortableItemProps = ItemProps & {
  /** Properties exclusive to Items within a SortableSection. */
  draggableProps: DraggableProps,
};
