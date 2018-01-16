// @flow
import type { Node } from 'react';

export type GroupType = {
  heading?: string,
  items: Array<ItemType>,
};

export type FooterType = {
  content?: string,
  elemBefore?: Node,
  onActivate?: Function,
  appearance?: 'default' | 'primary',
};

export type ItemType = {
  /** Hold an array of strings to compare against multi-select's filterValue */
  filterValues?: Array<string>,
  /** The content to be displayed in the drop list and also in the tag when selected.  */
  content: string,
  /** Text to be displayed below the item in the drop list. */
  description?: string,
  /** The value to be used when multi-select is submitted in a form. Also used internally. */
  value: string | number, // eslint-disable-line react/no-unused-prop-types, max-len
  /** Set whether the item is selectable. */
  isDisabled?: boolean,
  /** Set whether the item is selected. Selected items will be displayed as a
   tag instead of in the drop list. */
  isSelected?: boolean,
  /** Element before item. Used to provide avatar when desired. */
  elemBefore?: Node,
  /** Object which will pass on some properties to the @atlaskit/tag element when selected. */
  tag?: TagType, // eslint-disable-line react/no-unused-prop-types
};

export type TagType = {
  appearance?: string,
  elemBefore?: Node,
};
