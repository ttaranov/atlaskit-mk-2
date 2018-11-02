// @flow

import Select, {
  CreatableSelect,
  components,
  mergeStyles,
} from '@atlaskit/select';
import { format, isValid } from 'date-fns';
import pick from 'lodash.pick';
import React, { Component, type Node } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { colors } from '@atlaskit/theme';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

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
  /** Function for formatting the displayed time value in the input. By default parses with an internal time parser, and formats using the [date-fns format function]((https://date-fns.org/v1.29.0/docs/format)) */
  formatDisplayLabel: (time: string, timeFormat: string) => string,
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
  parseInputValue: (time: string, timeFormat: string) => Date | typeof NaN,
  /** Props to apply to the select. */
  selectProps: Object,
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing: 'compact' | 'default',
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
  timeFormat: string,
  /** Placeholder text displayed in input */
  placeholder?: string,
};

type State = {
  isOpen: boolean,
  value: string,
  isFocused: boolean,
};
/** Returns a formatted DT string if valid or empty string if not valid */
function formatTime(time: string, timeFormat: string): string {
  const date = parseTime(time);
  if (date instanceof Date) {
    return isValid(date) ? format(date, timeFormat) : time;
  }
  return '';
}

const menuStyles = {
  /* Need to remove default absolute positioning as that causes issues with position fixed */
  position: 'static',
  /* Need to add overflow to the element with max-height, otherwise causes overflow issues in IE11 */
  overflowY: 'auto',
};

const FixedLayerMenu = ({ selectProps, ...rest }: { selectProps: any }) => (
  <FixedLayer
    inputValue={selectProps.inputValue}
    containerRef={selectProps.fixedLayerRef}
    content={<components.Menu {...rest} menuShouldScrollIntoView={false} />}
  />
);

class TimePicker extends Component<Props, State> {
  containerRef: ?HTMLElement;

  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    defaultIsOpen: false,
    defaultValue: '',
    hideIcon: false,
    formatDisplayLabel: formatTime,
    id: '',
    innerProps: {},
    isDisabled: false,
    isInvalid: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    placeholder: 'e.g. 8:00am',
    parseInputValue: (time: string, timeFormat: string) => parseTime(time), // eslint-disable-line no-unused-vars
    selectProps: {},
    spacing: 'default',
    times: defaultTimes,
    timeIsEditable: false,
    timeFormat: defaultTimeFormat,
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
    const { parseInputValue, timeFormat } = this.props;
    const value =
      format(parseInputValue(inputValue, timeFormat), 'HH:mm') || '';
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
      formatDisplayLabel,
      id,
      innerProps,
      isDisabled,
      name,
      placeholder,
      selectProps,
      spacing,
      timeFormat,
    } = this.props;
    const { value = '', isOpen } = this.getState();
    const validationState = this.props.isInvalid ? 'error' : 'default';
    const icon =
      this.props.appearance === 'subtle' || this.props.hideIcon
        ? null
        : this.props.icon;

    const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;
    const controlStyles =
      this.props.appearance === 'subtle'
        ? this.getSubtleControlStyles(selectStyles)
        : {};
    const SelectComponent = this.props.timeIsEditable
      ? CreatableSelect
      : Select;

    const labelAndValue = value && {
      label: formatDisplayLabel(value, timeFormat),
      value,
    };

    return (
      <div {...innerProps} ref={this.getContainerRef}>
        <input name={name} type="hidden" value={value} />
        <SelectComponent
          autoFocus={autoFocus}
          components={{
            ClearIndicator,
            DropdownIndicator,
            Menu: FixedLayerMenu,
          }}
          instanceId={id}
          isDisabled={isDisabled}
          menuIsOpen={isOpen && !isDisabled}
          menuPlacement="auto"
          openMenuOnFocus
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
          value={labelAndValue}
          spacing={spacing}
          dropdownIndicatorIcon={icon}
          fixedLayerRef={this.containerRef}
          validationState={validationState}
          {...otherSelectProps}
        />
      </div>
    );
  }
}

export { TimePicker as TimePickerWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'timePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'selectedTime',
      actionSubject: 'timePicker',

      attributes: {
        componentName: 'timePicker',
        packageName,
        packageVersion,
      },
    }),
  })(TimePicker),
);
