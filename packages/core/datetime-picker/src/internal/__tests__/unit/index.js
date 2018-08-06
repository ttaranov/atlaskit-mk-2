// @flow

import { mount } from 'enzyme';
import React from 'react';
import { parse, format } from 'date-fns';
import { TimePickerWithoutAnalytics as TimePicker } from '../../../components/TimePicker';
import { DatePickerWithoutAnalytics as DatePicker } from '../../../components/DatePicker';

import {
  ClearIndicator,
  defaultTimes,
  DropdownIndicator,
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
