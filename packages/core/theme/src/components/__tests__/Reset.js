// @flow

import React from 'react';
import Reset from '../Reset';
import Theme from '../Theme';
import { mount } from 'enzyme';

test('reset', () => {
  expect(mount(<Reset />)).toMatchSnapshot();
});

test('themed reset', () => {
  expect(
    mount(
      <Theme backgroundColor="#000" textColor="#fff" linkColor="blue">
        <Reset />
      </Theme>,
    ),
  ).toMatchSnapshot();
});
