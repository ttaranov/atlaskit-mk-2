// @flow

import moment from 'moment';
import { mount } from 'enzyme';
import React from 'react';
import { parse, format } from 'date-fns';
import { TimePickerWithoutAnalytics as TimePicker } from '../../../components/TimePicker';
import { DatePickerWithoutAnalytics as DatePicker } from '../../../components/DatePicker';
import { DateTimePickerWithoutAnalytics as DateTimePicker } from '../../../components/DateTimePicker';

import {
  ClearIndicator,
  defaultTimes,
  DropdownIndicator,
  formatDateTimeZoneIntoIso,
  parseDateIntoStateValues,
} from '../..';

test('ClearIndicator', () => {
  expect(ClearIndicator).toBe(null);
});

test('defaultTimes', () => {
  expect(defaultTimes).toMatchSnapshot();
});

test('DropdownIndicator', () => {
  expect(mount(<DropdownIndicator selectProps={{}} />)).toMatchSnapshot();
  expect(
    mount(
      <DropdownIndicator selectProps={{ dropdownIndicatorIcon: 'asdf' }} />,
    ),
  ).toMatchSnapshot();
});

// Convert our test values to the local timezone and use those as expected values so that
// test results don't rely on a specific timezone
const testISODate = parse('2018-04-12T09:30+1000');
const testValue = format(testISODate);
const testDateValue = format(testISODate, 'YYYY-MM-DD');
const testTimeValue = format(testISODate, 'HH:mm');
const testZoneValue = format(testISODate, 'ZZ');

test('parseDateIntoStateValues', () => {
  expect(parseDateIntoStateValues('', testDateValue, '', '')).toEqual({
    dateValue: testDateValue,
    timeValue: '',
    zoneValue: '',
  });
  expect(parseDateIntoStateValues('', '', testTimeValue, '')).toEqual({
    dateValue: '',
    timeValue: testTimeValue,
    zoneValue: '',
  });
  expect(
    parseDateIntoStateValues('', testDateValue, testTimeValue, ''),
  ).toEqual({
    dateValue: testDateValue,
    timeValue: testTimeValue,
    zoneValue: '',
  });
  expect(parseDateIntoStateValues(testValue, '', '', '')).toEqual({
    dateValue: testDateValue,
    timeValue: testTimeValue,
    zoneValue: testZoneValue,
  });
  expect(
    parseDateIntoStateValues(testISODate, '2017-05-03', '14:00', '-0500'),
  ).toEqual({
    dateValue: testDateValue,
    timeValue: testTimeValue,
    zoneValue: testZoneValue,
  });
  expect(parseDateIntoStateValues('', '', '', '')).toEqual({
    dateValue: '',
    timeValue: '',
    zoneValue: '',
  });
});

test('TimePicker invalid times should be cleared', () => {
  const timePickerWrapper = mount(
    <TimePicker id="timepicker-1" timeIsEditable />,
  );
  // Simulate user entering invalid date
  timePickerWrapper
    .find('Control Input')
    .simulate('focus')
    .simulate('keydown', { key: 'a' })
    .simulate('keydown', { key: 's' })
    .simulate('keydown', { key: 'd' })
    .simulate('keydown', { key: 'Enter' })
    .simulate('blur');

  expect(timePickerWrapper.state().value).toEqual('');
});

test('DatePicker default parseInputValue parses valid dates to the expected value', () => {
  const onChangeSpy = jest.fn();
  const expectedResult = '2018-01-02';
  const datePickerWrapper = mount(
    <DatePicker
      id="defaultDatePicker-ParseInputValue"
      onChange={onChangeSpy}
    />,
  );

  datePickerWrapper.instance().onSelectInput({ target: { value: '01/02/18' } });
  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DatePicker, supplying a custom parseInputValue prop, produces the expected result', () => {
  const parseInputValue = (date, dateFormat) => new Date('01/01/1970'); //eslint-disable-line no-unused-vars
  const onChangeSpy = jest.fn();
  const expectedResult = '1970-01-01';
  const datePickerWrapper = mount(
    <DatePicker
      id="customDatePicker-ParseInputValue"
      onChange={onChangeSpy}
      parseInputValue={parseInputValue}
    />,
  );

  datePickerWrapper.instance().onSelectInput({ target: { value: 'asdf' } });
  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('TimePicker default parseInputValue', () => {
  const onChangeSpy = jest.fn();
  const expectedResult = '01:30';
  const timePickerWrapper = mount(
    <TimePicker timeIsEditable onChange={onChangeSpy} />,
  );
  timePickerWrapper.instance().onCreateOption('01:30');

  expect(onChangeSpy).toBeCalledWith(expectedResult);
});
test('TimePicker custom parseInputValue', () => {
  //eslint-disable-next-line no-unused-vars
  const parseInputValue = time => {
    return new Date('1970-01-02 01:15:00');
  };
  const onChangeSpy = jest.fn();
  const expectedResult = '01:15';
  const timePickerWrapper = mount(
    <TimePicker
      timeIsEditable
      onChange={onChangeSpy}
      parseInputValue={parseInputValue}
    />,
  );
  timePickerWrapper.instance().onCreateOption('asdf');
  expect(onChangeSpy).toBeCalledWith(expectedResult);
});

test('DateTimePicker, default parseValue, does not parse the date time value into the specified timezone', () => {
  const dateTimePickerWrapper = mount(
    <DateTimePicker
      id="datetimepicker-1"
      value={'2018-05-02T08:00:00.000+0800'}
    />,
  );
  expect(dateTimePickerWrapper.instance().getState().zoneValue).not.toEqual(
    '+0800',
  );
});

test('DatePicker, custom formatDisplayLabel', () => {
  const dateValue = new Date('08/06/2018').toUTCString();
  const formatDisplayLabel = (date, dateFormat) => {
    moment.locale('fr');
    return moment(date).format(dateFormat);
  };
  const expectedResult = 'août/06';
  const datePickerWrapper = mount(
    <DatePicker
      formatDisplayLabel={formatDisplayLabel}
      dateFormat={'MMMM/DD'}
      value={dateValue}
    />,
  );
  const label = datePickerWrapper.text();
  expect(label).toEqual(expectedResult);
});

test('TimePicker, custom formatDisplayLabel', () => {
  const timeValue = '12:00';
  const expectedResult = 'midday';
  const formatDisplayLabel = time => {
    if (time === '12:00') return 'midday';
    return time;
  };
  const timePickerWrapper = mount(
    <TimePicker formatDisplayLabel={formatDisplayLabel} value={timeValue} />,
  );
  const label = timePickerWrapper.text();

  expect(label).toEqual(expectedResult);
});

test('DateTimePicker, custom parseValue', () => {
  const customParseValue = (dateTimeValue, dateValue, timeValue, zoneValue) => {
    const parsedValue = moment(dateTimeValue).parseZone();
    return {
      dateValue: parsedValue.isValid
        ? parsedValue.format('YYYY-MM-DD')
        : dateValue,
      timeValue: parsedValue.isValid ? parsedValue.format('HH:mm') : timeValue,
      zoneValue: parsedValue.isValid ? parsedValue.format('ZZ') : zoneValue,
    };
  };
  const dateTimePickerWrapper = mount(
    <DateTimePicker
      parseValue={customParseValue}
      value={'2018-05-02T08:00:00.000+0800'}
    />,
  );
  const dateTimePickerState = dateTimePickerWrapper.instance().getState();
  expect(dateTimePickerState.dateValue).toEqual('2018-05-02');
  expect(dateTimePickerState.timeValue).toEqual('08:00');
  expect(dateTimePickerState.zoneValue).toEqual('+0800');
});

test('DateTimePicker, formatDateTimeZoneIntoIso returns empty value if there is no date', () => {
  const date = '';
  const time = '11:30';
  const zone = '+1100';
  const value = formatDateTimeZoneIntoIso(date, time, zone);
  expect(value).toEqual('');
});

test('DateTimePicker, formatDateTimeZoneIntoIso returns Iso string value if date', () => {
  const date = '2018-10-18';
  const time = '11:30';
  const zone = '+1100';
  const value = formatDateTimeZoneIntoIso(date, time, zone);
  expect(value).toEqual('2018-10-18T11:30+1100');
});

test('DatePicker, onCalendarChange if the iso date is greater than the last day of the month, focus the last day of the month instead', () => {
  const date = '2018-02-31';
  const fallbackDate = '2018-02-28';
  const datePickerWrapper = mount(<DatePicker />);
  datePickerWrapper.instance().onCalendarChange({ iso: date });
  datePickerWrapper.update();
  expect(datePickerWrapper.instance().state.view).toEqual(fallbackDate);
});
