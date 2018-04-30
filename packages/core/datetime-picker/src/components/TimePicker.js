// @flow

import { CreatableSelect, components, mergeStyles } from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import pick from 'lodash.pick';
import React, { Component, type Node } from 'react';

import { ClearIndicator, defaultTimes, DropdownIndicator } from '../internal';
import FixedLayer from '../internal/FixedLayer';

type Option = {
  label: string,
  value: string,
};

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Default appearance includes icon & sublte only shows icon on focus */
  appearance?: 'default' | 'subtle',
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `isOpen`. */
  defaultIsOpen: boolean,
  /** Default for `value`. */
  defaultValue: string,
  /** The icon to show in the field. */
  icon?: Node,
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string,
  /** Props to apply to the container. **/
  innerProps: Object,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the field is blurred. */
  onBlur: () => void,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: string => void,
  /** Called when the field is focused. */
  onFocus: () => void,
  /** Props to apply to the select. */
  selectProps: Object,
  /** The times to show in the dropdown. */
  times: Array<string>,
  /** Allow users to edit the input and add a time */
  timeIsEditable?: boolean,
  /** The ISO time that should be used as the input value. */
  value?: string,
  /** Indicates current value is invalid & changes border color */
  isInvalid?: boolean,
};

type State = {
  isOpen: boolean,
  value: string,
};

function dateFromTime(time: string): Date {
  const [h, m] = time.match(/(\d\d):(\d\d)/) || [];
  return h && m ? parse(`0000-00-00T${h}:${m}`) : new Date('invalid date');
}

function formatTime(time: string): string {
  const date = dateFromTime(time);
  return isValid(date) ? format(date, 'h:mma') : time;
}

const menuStyles = {
  /* Need to remove default absolute positioning as that causes issues with position fixed */
  position: 'static',
  /* Need to add overflow to the element with max-height, otherwise causes overflow issues in IE11 */
  overflowY: 'auto',
};

export default class TimePicker extends Component<Props, State> {
  containerRef: ?HTMLElement;

  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    isDisabled: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    times: defaultTimes,
    selectProps: {},
    innerProps: {},
    id: '',
    defaultIsOpen: false,
    defaultValue: '',
    timeIsEditable: false,
    isInvalid: false,
  };

  state = {
    isOpen: this.props.defaultIsOpen,
    value: this.props.defaultValue,
  };

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getState = () => {
    return {
      ...this.state,
      ...pick(this.props, ['value', 'isOpen']),
    };
  };

  getOptions(): Array<Option> {
    return this.props.times.map((time: string): Option => {
      return {
        label: formatTime(time),
        value: time,
      };
    });
  }

  onChange = (v: Object | null): void => {
    const value = v ? v.value : '';
    this.setState({ value });
    this.props.onChange(value);
  };

  /** Only allow custom times if timeIsEditable prop is true  */
  onCreateOption = (inputValue: any): void => {
    const value = inputValue || '';
    if (this.props.timeIsEditable) {
      this.setState({ value });
      this.props.onChange(value);
    } else {
      this.onChange(inputValue);
    }
  };

  onMenuOpen = () => {
    this.setState({ isOpen: true });
  };

  onMenuClose = () => {
    this.setState({ isOpen: false });
  };

  getContainerRef = (ref: ?HTMLElement) => {
    const oldRef = this.containerRef;
    this.containerRef = ref;
    // Cause a re-render if we're getting the container ref for the first time
    // as the layered menu requires it for dimension calculation
    if (oldRef == null && ref != null) {
      this.forceUpdate();
    }
  };

  render() {
    const {
      autoFocus,
      id,
      innerProps,
      isDisabled,
      name,
      onBlur,
      onFocus,
      selectProps,
    } = this.props;
    const { value, isOpen } = this.getState();
    const validationState = this.props.isInvalid ? 'error' : 'default';
    const icon = this.props.appearance === 'subtle' ? null : this.props.icon;

    const FixedLayerMenu = props => {
      return (
        <FixedLayer
          containerRef={this.containerRef}
          content={<components.Menu {...props} scrollMenuIntoView={false} />}
        />
      );
    };

    const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;

    return (
      <div {...innerProps} ref={this.getContainerRef}>
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <CreatableSelect
          autoFocus={autoFocus}
          components={{
            ClearIndicator,
            DropdownIndicator: () => <DropdownIndicator icon={icon} />,
            Menu: FixedLayerMenu,
          }}
          instanceId={id}
          isDisabled={isDisabled}
          menuIsOpen={isOpen && !isDisabled}
          menuPlacement="auto"
          onBlur={onBlur}
          onCreateOption={this.onCreateOption}
          onChange={this.onChange}
          options={this.getOptions()}
          onFocus={onFocus}
          onMenuOpen={this.onMenuOpen}
          onMenuClose={this.onMenuClose}
          placeholder="e.g. 9:00am"
          styles={mergeStyles(selectStyles, {
            menu: base => ({
              ...base,
              ...menuStyles,
              ...{
                // Fixed positioned elements no longer inherit width from their parent, so we must explicitly set the
                // menu width to the width of our container
                width: this.containerRef
                  ? this.containerRef.getBoundingClientRect().width
                  : 'auto',
              },
            }),
          })}
          value={
            value && {
              label: formatTime(value),
              value,
            }
          }
          {...otherSelectProps}
          validationState={validationState}
        />
      </div>
    );
  }
}
