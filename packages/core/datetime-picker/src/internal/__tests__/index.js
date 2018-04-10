// @flow

import { mount } from 'enzyme';
import React from 'react';
import { parse, format } from 'date-fns';

import {
  ClearIndicator,
  defaultTimes,
  DropdownIndicator,
  parseDateIntoStateValues,
} from '..';

test('ClearIndicator', () => {
  expect(ClearIndicator).toBe(null);
});

test('defaultTimes', () => {
  expect(defaultTimes).toMatchSnapshot();
});

test('DropdownIndicator', () => {
  expect(mount(<DropdownIndicator />)).toMatchSnapshot();
  expect(mount(<DropdownIndicator icon="asdf" />)).toMatchSnapshot();
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
