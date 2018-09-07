// @flow

import type { DropResult } from 'react-beautiful-dnd';

import type { SectionProps } from '../Section/types';
import type { GroupProps } from '../Group/types';
import type { ItemProps } from '../Item/types';

type Items = {
  [id: string]: ItemProps,
};
type Groups = {
  [id: string]: GroupProps & {
    itemIds: Array<string>,
  },
};

export type SortableSectionProps = SectionProps & {
  /** The group ID, used to drag between groups */
  id: string,
  /** Objects that represent items to be rendered */
  items: Items,
  /** Objects that represent groups to be rendered */
  groups: Groups,
  /** The order to render the groups */
  groupOrder: Array<string>,
  /** Function called on `dragEnd` event. */
  onDragEnd: (Groups, DropResult) => mixed,
};
