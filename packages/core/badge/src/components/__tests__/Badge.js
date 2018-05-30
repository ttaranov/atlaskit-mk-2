// @flow

import { shallow } from 'enzyme';
import React from 'react';
import Badge from '../Badge';

test('snapshot', () => {
  expect(shallow(<Badge />)).toMatchSnapshot();
});
