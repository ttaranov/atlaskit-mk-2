// @flow
import { PureComponent, type Node } from 'react';
import type { TagType } from '../types';

/** ************************************************************************************************
  This file exists so that we have a component we can pass the @atlaskit/readme Props component
  We reuse the definition to define the itemShape in StatelessMultiSelect as well
**************************************************************************************************/
// eslint-disable-line react/no-unused-prop-types
type Props = {
  /** Hold an array of strings to compare against multi-select's filterValue */
  filterValues: Array<string>, // eslint-disable-line react/no-unused-prop-types
  /** The content to be displayed in the drop list and also in the tag when selected.  */
  content: string, // eslint-disable-line react/no-unused-prop-types
  /** Text to be displayed below the item in the drop list. */
  description: string, // eslint-disable-line react/no-unused-prop-types
  /** The value to be used when multi-select is submitted in a form. Also used internally. */
  value: string | number, // eslint-disable-line react/no-unused-prop-types, max-len
  /** Set whether the item is selectable. */
  isDisabled: boolean, // eslint-disable-line react/no-unused-prop-types
  /** Set whether the item is selected. Selected items will be displayed as a
   tag instead of in the drop list. */
  isSelected: boolean, // eslint-disable-line react/no-unused-prop-types
  /** Element before item. Used to provide avatar when desired. */
  elemBefore: Node, // eslint-disable-line react/no-unused-prop-types
  /** Object which will pass on some properties to the @atlaskit/tag element when selected. */
  tag: TagType, // eslint-disable-line react/no-unused-prop-types
};

export default class ItemShape extends PureComponent<Props, {}> {
  static defaultProps = {
    isDisabled: false,
    isSelected: false,
  };
  render() {
    return null;
  }
}
