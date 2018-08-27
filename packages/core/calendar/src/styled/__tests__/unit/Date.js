// @flow

import { shallow } from 'enzyme';
import React from 'react';
import { DateDiv } from '../../../styled/Date';

test('cursor should be "default"', () => {
  // $FlowFixMe - https://github.com/facebook/flow/issues/396
  expect(shallow(<DateDiv />)).toHaveStyleRule('cursor', 'pointer');
});

test('disabled - cursor should be "not-allowed"', () => {
  // $FlowFixMe - https://github.com/facebook/flow/issues/396
  expect(shallow(<DateDiv disabled />)).toHaveStyleRule(
    'cursor',
    'not-allowed',
  );
});
