// @flow

import type { ElementConfig } from 'react';
import type {
  OnDragEndHook,
  OnDragStartHook,
  OnDragUpdateHook,
} from 'react-beautiful-dnd';

import Section from '../../presentational/Section';

export type SortableSectionProps = {
  ...$Exact<ElementConfig<typeof Section>>,
  /** Called when a sortable item drag has started. See react-beautiful-dnd's [onDragStart](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/hooks.md#ondragstart-optional) hook. */
  onDragStart?: OnDragStartHook,
  /** Called when a sortable item has updated position. See react-beautiful-dnd's [onDragUpdate](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/hooks.md#ondragupdate-optional) hook. */
  onDragUpdate?: OnDragUpdateHook,
  /** Called when a sortable item drag has ended. See react-beautiful-dnd's
   * [onDragEnd](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/hooks.md#ondragend-required) hook.
   * Note the droppableId fields correspond to the id's of a SortableGroup component.
   */
  onDragEnd: OnDragEndHook,
};
