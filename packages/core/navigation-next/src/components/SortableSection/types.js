// @flow

import type { Node } from 'react';
import type {
  DropResult,
  OnDragEndHook,
  OnDragStartHook,
  OnDragUpdateHook,
} from 'react-beautiful-dnd';

import type { SectionProps, SectionChildren } from '../Section/types';
import type { GroupProps } from '../Group/types';
import type { ItemProps } from '../Item/types';

type GroupPropsNoChildren = $Diff<GroupProps, { children: Node }>;
export type GroupType = GroupPropsNoChildren & {
  itemIds: Array<string>,
};
export type ItemsType = {
  [id: string]: ItemProps,
};
export type GroupsType = Array<GroupType>;

type SectionPropsNoChildren = $Diff<
  SectionProps,
  { children: SectionChildren },
>;

export type SortableSectionProps = SectionPropsNoChildren & {
  /**
    Object of objects representing item props, will be rendered by the group
    with their matching `itemId`.
  */
  items: ItemsType,
  /**
    Array of objects representing group props with an additional `itemIds` array.
  */
  groups: GroupsType,
  /**
    A helper function. The applicable groups' `itemIds` arrays are re-sorted and
    the new `Groups` provided as the first argument. Access to the original
    `DropResult` object is available as the second argument.

    If you need to handle sorting within your app instead use the `onDragEnd`
    property.
  */
  onChange?: (GroupsType, DropResult) => mixed,
  onDragStart?: OnDragStartHook,
  onDragUpdate?: OnDragUpdateHook,
  onDragEnd?: OnDragEndHook,
};
