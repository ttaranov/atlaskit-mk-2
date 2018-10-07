// @flow

import React from 'react';
import { mount } from 'enzyme';
import Reset from '../../Reset';
import Theme from '../../Theme';

test('reset', () => {
  expect(mount(<Reset />)).toMatchSnapshot();
});

test('themed reset', () => {
  expect(
    mount(
      <Theme
        theme={() => ({
          backgroundColor: '#000',
          textColor: '#fff',
          linkColor: 'blue',
        })}
      >
        <Reset />
      </Theme>,
    ),
  ).toMatchSnapshot();
});
