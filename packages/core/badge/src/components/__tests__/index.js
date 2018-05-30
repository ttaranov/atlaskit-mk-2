// @flow

import { mount, shallow } from 'enzyme';
import React from 'react';
import Badge from '..';
import Format from '../Format';

function getFormatProps(badge) {
  return mount(badge)
    .find(Format)
    .props();
}

test('snapshot', () => {
  expect(shallow(<Badge />)).toMatchSnapshot();
});

test('DEPRECATED - value', () => {
  expect(getFormatProps(<Badge value={100} />)).toMatchObject({
    children: 100,
  });
});

test('children', () => {
  expect(getFormatProps(<Badge>{100}</Badge>)).toMatchObject({ children: 100 });
});
