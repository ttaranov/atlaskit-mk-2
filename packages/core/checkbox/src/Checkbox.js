// @flow

import React, { Component } from 'react';
import CheckboxStateless from './CheckboxStateless';

type Common = {|
  /** The name of the submitted field in a checkbox. */
  name: string,
  /** The value to be used in the checkbox input. This is the value that will
   be returned on form submission. */
  value: number | string,
|};

type Props = {|
  /** Sets whether the checkbox begins checked. */
  initiallyChecked?: boolean,
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean,
  /** Sets whether the checkbox should take up the full width of the parent. */
  isFullWidth?: boolean,
  /** The label to be displayed to the right of the checkbox. The label is part
   of the clickable element to select the checkbox. */
  label: string,
  /** Marks the field as invalid. Changes style of unchecked component. */
  isInvalid?: boolean,
  /** Function that is called whenever the state of the checkbox changes. It will
  be called with an object containing the react synthetic event as well as the
  new state of the checkbox. */
  onChange?: ({
    event: SyntheticEvent<any>,
    isChecked: boolean,
    ...Common,
  }) => mixed,
|} & Common;

type State = {
  isChecked: boolean,
};

export default class Checkbox extends Component<Props, State> {
  props: Props; // eslint-disable-line react/sort-comp

  static defaultProps = {
    initiallyChecked: false,
    onChange: () => {},
  };

  state = { isChecked: !!this.props.initiallyChecked };

  onChange = (
    event: SyntheticEvent<any> & { currentTarget: HTMLInputElement },
  ) => {
    const { isDisabled, onChange, name, value } = this.props;
    if (isDisabled) return null;
    const isChecked = event.currentTarget.checked;
    return this.setState({ isChecked }, () => {
      if (onChange) onChange({ event, isChecked, name, value });
    });
  };

  render() {
    const {
      label,
      value,
      isFullWidth,
      isDisabled,
      isInvalid,
      name,
    } = this.props;
    const { isChecked } = this.state;
    return (
      <CheckboxStateless
        isChecked={isChecked}
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
        isInvalid={isInvalid}
        label={label}
        name={name}
        onChange={this.onChange}
        value={value}
      />
    );
  }
}
