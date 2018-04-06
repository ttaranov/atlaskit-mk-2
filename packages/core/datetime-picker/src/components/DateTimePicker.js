// @flow

import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { borderRadius, colors } from '@atlaskit/theme';
import pick from 'lodash.pick';
import React, { Component } from 'react';
import styled from 'styled-components';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import { parseDateIntoStateValues } from '../internal';

/* eslint-disable react/no-unused-prop-types */
type Props = {
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
  /** Called when the value changes and the date / time is a complete value, or empty. The first argument is an ISO string.  The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onChange: (string, analyticsEvent?: UIAnalyticsEvent) => void,
  /** Called when the field is focused. */
  onFocus: () => void,
  /** The ISO time that should be used as the input value. */
  value?: string,
};

type State = {
  active: 0 | 1 | 2,
  dateValue: string,
  isFocused: boolean,
  timeValue: string,
  value: string,
  zoneValue: string,
};

const Flex = styled.div`
  background-color: ${colors.N10};
  border-radius: ${borderRadius()}px;
  display: flex;
  transition: background-color 200ms ease-in-out, border-color 200ms ease-in-out;
  ${({ isFocused }) => `
    border: ${
      isFocused ? `2px solid ${colors.B100}` : `1px solid ${colors.N20}`
    };
    padding: ${isFocused ? '0' : '1px'};
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
    border: 0,
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
    autoFocus: false,
    isDisabled: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    innerProps: {},
    id: '',
    defaultValue: '',
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
      ...parseDateIntoStateValues(
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
    if (dateValue && timeValue) {
      const value = formatDateTimeZoneIntoIso(dateValue, timeValue, zoneValue);
      this.setState({ value });
      this.props.onChange(value);
    }
  }

  render() {
    const { autoFocus, id, innerProps, isDisabled, name } = this.props;
    const { isFocused, value, dateValue, timeValue } = this.getState();
    const bothProps = {
      isDisabled,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
    };
    return (
      <Flex {...innerProps} isFocused={isFocused} isDisabled={isDisabled}>
        <input name={name} type="hidden" value={value} />
        <FlexItem>
          <DatePicker
            {...bothProps}
            autoFocus={autoFocus}
            icon={null}
            id={id}
            onChange={this.onDateChange}
            selectProps={{ styles }}
            value={dateValue}
          />
        </FlexItem>
        <FlexItem>
          <TimePicker
            {...bothProps}
            icon={CalendarIcon}
            onChange={this.onTimeChange}
            selectProps={{ styles }}
            value={timeValue}
          />
        </FlexItem>
      </Flex>
    );
  }
}

export { DateTimePicker as DateTimePickerBase };

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  component: 'date-picker',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'change',
    }),
  })(DateTimePicker),
);
