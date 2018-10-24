// @flow

import type { ElementConfig } from 'react';
import type {
  OnDragEndHook,
  OnDragStartHook,
  OnDragUpdateHook,
} from 'react-beautiful-dnd';

import Section from '../Section';

export type SortableSectionProps = ElementConfig<typeof Section> & {
  onDragStart?: OnDragStartHook,
  onDragUpdate?: OnDragUpdateHook,
  onDragEnd?: OnDragEndHook,
};
