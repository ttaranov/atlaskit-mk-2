// @flow

import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { mergeStyles } from '@atlaskit/select';
import { borderRadius, colors } from '@atlaskit/theme';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import pick from 'lodash.pick';
import React, { Component } from 'react';
import styled from 'styled-components';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import {
  parseDateIntoStateValues,
  defaultTimes,
  defaultDateFormat,
  defaultTimeFormat,
} from '../internal';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Defines the appearance which can be default or subtle - no borders, background or icon. */
  appearance?: 'default' | 'subtle',
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `value`. */
  defaultValue: string,
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string,
  /** Props to apply to the container. **/
  innerProps: Object,
  /** Whether or not the field is disabled. */
  isDisabled: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the field is blurred. */
  onBlur: () => void,
  /** Called when the value changes and the date / time is a complete value, or empty. The only value is an ISO string. */
  onChange: string => void,
  /** Called when the field is focused. */
  onFocus: () => void,
  /** The ISO time that should be used as the input value. */
  value?: string,
  /** Allow users to edit the input and add a time. */
  timeIsEditable?: boolean,
  /** Indicates current value is invalid & changes border color. */
  isInvalid?: boolean,
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean,
  /** Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat?: string,
  datePickerProps: {},
  timePickerProps: {},
  /** Function to parse passed in dateTimePicker value into the requisite sub values date, time and zone. **/
  parseValue: (
    dateTimeValue: string,
    date: string,
    time: string,
    timezone: string,
  ) => { dateValue: string, timeValue: string, zoneValue: string },
  /** [Select props](/packages/core/select) to pass onto the DatePicker component. This can be used to set options such as placeholder text. */
  datePickerSelectProps: {},
  /** [Select props](/packages/core/select) to pass onto the TimePicker component. This can be used to set options such as placeholder text. */
  timePickerSelectProps: {},
  /** The times to show in the times dropdown. */
  times?: Array<string>,
  /** Time format that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format)*/
  timeFormat?: string,
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: 'compact' | 'default',
};

type State = {
  active: 0 | 1 | 2,
  dateValue: string,
  isFocused: boolean,
  timeValue: string,
  value: string,
  zoneValue: string,
};

/** Border style is defined by the appearnace and whether it is invalid. */
function getBorderStyle(isInvalid: boolean, appearance: 'default' | 'subtle') {
  if (isInvalid) return `2px solid ${colors.R400}`;
  if (appearance === 'subtle') return `2px solid transparent`;
  return `1px solid ${colors.N20}`;
}
/** Padding style is defined by the appearnace and whether it is invalid. */
function getPaddingStyle(isFocused: boolean, appearance: 'default' | 'subtle') {
  if (appearance === 'subtle' || !isFocused) return `1px`;
  return '0px';
}

const Flex = styled.div`
  ${({ appearance }) => `
    background-color: ${appearance === 'subtle' ? 'transparent' : colors.N10}
    };
  `} border-radius: ${borderRadius()}px;
  display: flex;
  transition: background-color 200ms ease-in-out, border-color 200ms ease-in-out;
  ${({ isFocused, isInvalid, appearance }) => `
    border: ${
      isFocused
        ? `2px solid ${colors.B100}`
        : `${getBorderStyle(isInvalid, appearance)}`
    };
    padding: ${getPaddingStyle(isFocused, appearance)};
  `} &:hover {
    ${({ isFocused, isDisabled }) =>
      !isFocused && !isDisabled
        ? `
        background-color: ${colors.N20};
      `
        : ''};
  }
`;

const FlexItem = styled.div`
  flex-basis: 0;
  flex-grow: 1;
`;

// react-select overrides (via @atlaskit/select).
const styles = {
  control: style => ({
    ...style,
    backgroundColor: 'transparent',
    border: 2,
    borderRadius: 0,
    paddingLeft: 0,
    ':hover': {
      backgroundColor: 'transparent',
    },
  }),
};

function formatDateTimeZoneIntoIso(
  date: string,
  time: string,
  zone: string,
): string {
  return `${date}T${time}${zone}`;
}

class DateTimePicker extends Component<Props, State> {
  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    isDisabled: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    innerProps: {},
    id: '',
    defaultValue: '',
    timeIsEditable: false,
    isInvalid: false,
    hideIcon: false,
    datePickerProps: {},
    timePickerProps: {},
    parseValue: parseDateIntoStateValues,
    datePickerSelectProps: {},
    timePickerSelectProps: {},
    times: defaultTimes,
    timeFormat: defaultTimeFormat,
    dateFormat: defaultDateFormat,
    spacing: 'default',
  };

  state = {
    active: 0,
    dateValue: '',
    isFocused: false,
    timeValue: '',
    value: this.props.defaultValue,
    zoneValue: '',
  };

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getState = () => {
    const mappedState = {
      ...this.state,
      ...pick(this.props, ['value']),
    };

    return {
      ...mappedState,
      ...this.props.parseValue(
        mappedState.value,
        mappedState.dateValue,
        mappedState.timeValue,
        mappedState.zoneValue,
      ),
    };
  };

  onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlur();
  };

  onDateChange = (dateValue: string) => {
    this.onValueChange({ ...this.getState(), dateValue });
  };

  onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocus();
  };

  onTimeChange = (timeValue: string) => {
    this.onValueChange({ ...this.getState(), timeValue });
  };

  onValueChange({
    dateValue,
    timeValue,
    zoneValue,
  }: {
    dateValue: string,
    timeValue: string,
    zoneValue: string,
  }) {
    this.setState({ dateValue, timeValue, zoneValue });

    if (dateValue || timeValue) {
      const value = formatDateTimeZoneIntoIso(dateValue, timeValue, zoneValue);
      this.setState({ value });
      this.props.onChange(value);
    }
  }

  render() {
    const {
      autoFocus,
      id,
      innerProps,
      isDisabled,
      name,
      timeIsEditable,
      dateFormat,
      datePickerProps,
      datePickerSelectProps,
      timePickerProps,
      timePickerSelectProps,
      times,
      timeFormat,
    } = this.props;
    const { isFocused, value, dateValue, timeValue } = this.getState();
    const icon =
      this.props.appearance === 'subtle' || this.props.hideIcon
        ? null
        : CalendarIcon;
    const bothProps = {
      isDisabled,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      isInvalid: this.props.isInvalid,
      appearance: this.props.appearance,
      spacing: this.props.spacing,
    };

    const { styles: datePickerStyles = {} } = (datePickerSelectProps: any);
    const { styles: timePickerStyles = {} } = (timePickerSelectProps: any);

    const mergedDatePickerSelectProps = {
      ...datePickerSelectProps,
      styles: mergeStyles(styles, datePickerStyles),
    };

    const mergedTimePickerSelectProps = {
      ...timePickerSelectProps,
      styles: mergeStyles(styles, timePickerStyles),
    };

    return (
      <Flex
        {...innerProps}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isInvalid={bothProps.isInvalid}
        appearance={bothProps.appearance}
      >
        <input name={name} type="hidden" value={value} />
        <FlexItem>
          <DatePicker
            {...bothProps}
            autoFocus={autoFocus}
            dateFormat={dateFormat}
            icon={null}
            id={id}
            onChange={this.onDateChange}
            selectProps={mergedDatePickerSelectProps}
            value={dateValue}
            {...datePickerProps}
          />
        </FlexItem>
        <FlexItem>
          <TimePicker
            {...bothProps}
            icon={icon}
            onChange={this.onTimeChange}
            selectProps={mergedTimePickerSelectProps}
            value={timeValue}
            timeIsEditable={timeIsEditable}
            times={times}
            timeFormat={timeFormat}
            {...timePickerProps}
          />
        </FlexItem>
      </Flex>
    );
  }
}

export { DateTimePicker as DateTimePickerWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'dateTimePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'dateTimePicker',

      attributes: {
        componentName: 'dateTimePicker',
        packageName,
        packageVersion,
      },
    }),
  })(DateTimePicker),
);
