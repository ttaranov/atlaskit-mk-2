// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Max } from '../max';

test('default', () => {
  expect(shallow(<Max />).text()).toBe('0');
});

test('children', () => {
  expect(shallow(<Max>{-100}</Max>).text()).toBe('-100');
  expect(shallow(<Max>{0}</Max>).text()).toBe('0');
  expect(shallow(<Max>{100}</Max>).text()).toBe('100');
});

test('limit', () => {
  // Negatives
  expect(shallow(<Max limit={-100}>{-10}</Max>).text()).toBe('-100+');
  expect(shallow(<Max limit={-100}>{-1000}</Max>).text()).toBe('-1000');
  expect(shallow(<Max limit={Infinity}>{-1000}</Max>).text()).toBe('-1000');

  // Zero
  expect(shallow(<Max limit={-100}>{0}</Max>).text()).toBe('-100+');
  expect(shallow(<Max limit={100}>{0}</Max>).text()).toBe('0');
  expect(shallow(<Max limit={Infinity}>{0}</Max>).text()).toBe('0');

  // Positives
  expect(shallow(<Max limit={100}>{10}</Max>).text()).toBe('10');
  expect(shallow(<Max limit={100}>{1000}</Max>).text()).toBe('100+');
  expect(shallow(<Max limit={Infinity}>{1000}</Max>).text()).toBe('1000');
});

test('infinity', () => {
  expect(shallow(<Max>{Infinity}</Max>).text()).toBe('∞');
  expect(shallow(<Max limit={-100}>{Infinity}</Max>).text()).toBe('∞');
  expect(shallow(<Max limit={100}>{Infinity}</Max>).text()).toBe('∞');
  expect(shallow(<Max limit={Infinity}>{Infinity}</Max>).text()).toBe('∞');
});
