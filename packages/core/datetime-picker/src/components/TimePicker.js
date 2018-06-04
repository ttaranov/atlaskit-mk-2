// @flow

import Select, {
  CreatableSelect,
  components,
  mergeStyles,
} from '@atlaskit/select';
import { format, isValid, parse } from 'date-fns';
import pick from 'lodash.pick';
import React, { Component, type Node } from 'react';
import { colors } from '@atlaskit/theme';

import {
  ClearIndicator,
  defaultTimes,
  DropdownIndicator,
  parseTime,
  defaultTimeFormat,
} from '../internal';
import FixedLayer from '../internal/FixedLayer';

type Option = {
  label: string,
  value: string,
};

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Defines the appearance which can be default or subtle - no borders, background or icon.
   *  Appearance values will be ignored if styles are parsed via the selectProps.
   */
  appearance?: 'default' | 'subtle',
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `isOpen`. */
  defaultIsOpen: boolean,
  /** Default for `value`. */
  defaultValue: string,
  /** A function that formats the input value into the display value. */
  formatValue: string => string,
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
  /** Indicates current value is invalid & changes border color. */
  isInvalid?: boolean,
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean,
  /** Time format that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format)*/
  timeFormat?: string,
  /** Placeholder text displayed in input */
  placeholder?: string,
};

type State = {
  isOpen: boolean,
  value: string,
  isFocused: boolean,
};

function dateFromTime(time: string): Date {
  const [h, m] = time.match(/(\d\d):(\d\d)/) || [];
  return h && m ? parse(`0000-00-00T${h}:${m}`) : new Date('invalid date');
}

function formatTime(time: string, timeFormat: string): string {
  const date = dateFromTime(time);
  return isValid(date) ? format(date, timeFormat) : time;
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
    formatValue: value => formatTime(value, timeFormat),
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
    hideIcon: false,
    timeFormat: defaultTimeFormat,
    placeholder: `e.g. ${format(new Date(), defaultTimeFormat)}`,
  };

  state = {
    isOpen: this.props.defaultIsOpen,
    value: this.props.defaultValue,
    isFocused: false,
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
        /* $FlowFixMe - Flow complaining timeFormat is undefined but it has a default... */
        label: formatTime(time, this.props.timeFormat),
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
    const value = format(parseTime(inputValue), 'HH:mm') || '';
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

  onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlur();
  };

  onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocus();
  };

  getSubtleControlStyles = (selectStyles: any) => {
    if (selectStyles.control) return {};
    return {
      border: `2px solid ${
        this.getState().isFocused ? `${colors.B100}` : `transparent`
      }`,
      backgroundColor: 'transparent',
      padding: '1px',
    };
  };

  render() {
    const {
      autoFocus,
      formatValue,
      id,
      innerProps,
      isDisabled,
      name,
      selectProps,
      timeFormat,
      placeholder,
    } = this.props;
    const { value, isOpen } = this.getState();
    const validationState = this.props.isInvalid ? 'error' : 'default';
    const icon =
      this.props.appearance === 'subtle' || this.props.hideIcon
        ? null
        : this.props.icon;
    const FixedLayerMenu = props => {
      return (
        <FixedLayer
          containerRef={this.containerRef}
          content={<components.Menu {...props} scrollMenuIntoView={false} />}
        />
      );
    };

    const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;
    const controlStyles =
      this.props.appearance === 'subtle'
        ? this.getSubtleControlStyles(selectStyles)
        : {};
    const SelectComponent = this.props.timeIsEditable
      ? CreatableSelect
      : Select;

    return (
      <div {...innerProps} ref={this.getContainerRef}>
        <input name={name} type="hidden" value={value} />
        {/* $FlowFixMe - complaining about required args that aren't required. */}
        <SelectComponent
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
          onBlur={this.onBlur}
          onCreateOption={this.onCreateOption}
          onChange={this.onChange}
          options={this.getOptions()}
          onFocus={this.onFocus}
          onMenuOpen={this.onMenuOpen}
          onMenuClose={this.onMenuClose}
          placeholder={placeholder}
          styles={mergeStyles(selectStyles, {
            control: base => ({
              ...base,
              ...controlStyles,
            }),
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
              /* $FlowFixMe - complaining about required args that aren't required. */
              label: formatValue(value),
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
