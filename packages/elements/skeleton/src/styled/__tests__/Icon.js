/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import { shallow } from 'enzyme';
import React from 'react';

import Icon from '../Icon';

test('sets background colour to currentColor by default', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Icon />)).toHaveStyleRule('background-color', 'currentColor');
});

test('sets background colour from prop', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Icon color={'#FFFFFF'} />)).toHaveStyleRule(
    'background-color',
    '#FFFFFF',
  );
});
