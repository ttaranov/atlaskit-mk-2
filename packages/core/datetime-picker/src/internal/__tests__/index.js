// @flow

import { mount } from 'enzyme';
import React from 'react';

import { ClearIndicator, defaultTimes, DropdownIndicator } from '..';

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
