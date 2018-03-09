// @flow
import { PureComponent, type Node } from 'react';

/** ************************************************************************************************
  This file exists so that we have a component we can pass the @atlaskit/readme Props component
  We reuse the definition to define the itemShape in StatelessMultiSelect as well
**************************************************************************************************/

type Props = {
  /** Can be either a string or JSX. If using JSX, the label property must be supplied to
   * allow the component to filter properly. */
  content: Node, // eslint-disable-line react/no-unused-prop-types
  description: string, // eslint-disable-line react/no-unused-prop-types
  label: string, // eslint-disable-line react/no-unused-prop-types
  /** Label is only needed if content is JSX. */
  tooltipDescription: string, // eslint-disable-line react/no-unused-prop-types
  tooltipPosition: 'top' | 'bottom' | 'left', // eslint-disable-line react/no-unused-prop-types
  value: string | number, // eslint-disable-line react/no-unused-prop-types
  filterValues: Array<string>, // eslint-disable-line react/no-unused-prop-types
  isDisabled?: boolean, // eslint-disable-line react/no-unused-prop-types
  isSelected?: boolean, // eslint-disable-line react/no-unused-prop-types
  elemBefore: Node, // eslint-disable-line react/no-unused-prop-types
};

export default class DummyItem extends PureComponent<Props, {}> {
  static defaultProps = {
    isDisabled: false,
    isSelected: false,
  };
}
