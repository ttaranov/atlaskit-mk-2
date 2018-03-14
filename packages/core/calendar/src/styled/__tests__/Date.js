// @flow

import { shallow } from 'enzyme';
import React from 'react';
import { DateDiv } from '../../styled/Date';

test('cursor should be "default"', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<DateDiv />)).toHaveStyleRule('cursor', 'pointer');
});

test('disabled - cursor should be "not-allowed"', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<DateDiv disabled />)).toHaveStyleRule(
    'cursor',
    'not-allowed',
  );
});
