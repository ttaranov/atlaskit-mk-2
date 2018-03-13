// @flow
import type { Node } from 'react';

export type GroupType = {
  heading?: string,
  items: Array<ItemType>,
};

export type ItemType = {
  /** Can be either a string or JSX. If using JSX, the label property must be supplied to
   * allow the component to filter properly. */
  content?: Node,
  description?: string,
  /** Label is only needed if content is JSX. */
  label?: string,
  tooltipDescription?: string,
  tooltipPosition?: 'top' | 'bottom' | 'left',
  value?: string | number,
  filterValues?: Array<string>,
  isDisabled?: boolean,
  isSelected?: boolean,
  elemBefore?: Node,
};
