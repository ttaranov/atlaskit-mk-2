// @flow

import { mount } from 'enzyme';
import React from 'react';

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

test('parseDateIntoStateValues', () => {
  expect(parseDateIntoStateValues('', '2018-04-12', '', '')).toEqual({
    dateValue: '2018-04-12',
    timeValue: '',
    zoneValue: '',
  });
  expect(parseDateIntoStateValues('', '', '09:30', '')).toEqual({
    dateValue: '',
    timeValue: '09:30',
    zoneValue: '',
  });
  expect(parseDateIntoStateValues('', '2018-04-12', '09:30', '')).toEqual({
    dateValue: '2018-04-12',
    timeValue: '09:30',
    zoneValue: '',
  });
  expect(parseDateIntoStateValues('2018-04-12T09:30+1000', '', '', '')).toEqual(
    {
      dateValue: '2018-04-12',
      timeValue: '09:30',
      zoneValue: '+1000',
    },
  );
  expect(
    parseDateIntoStateValues(
      '2018-04-12T09:30+1000',
      '2017-05-03',
      '14:00',
      '-0500',
    ),
  ).toEqual({
    dateValue: '2018-04-12',
    timeValue: '09:30',
    zoneValue: '+1000',
  });
  expect(parseDateIntoStateValues('', '', '', '')).toEqual({
    dateValue: '',
    timeValue: '',
    zoneValue: '',
  });
});
