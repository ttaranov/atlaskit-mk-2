/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow
import React from 'react';
import { shallow } from 'enzyme';

import Avatar from '../Avatar';
import { assertCorrectColors, assertCorrectOpacity } from './_util';

test('correctly sets color from prop', () => {
  assertCorrectColors(Avatar);
});

test('correctly sets opacity from prop', () => {
  assertCorrectOpacity(Avatar);
});

test('styles a circular avatar when appearance is set to circle', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Avatar appearance="circle" />)).toHaveStyleRule(
    'border-radius',
    '50%',
  );
});

test('styles a rounded square avatar when appearance is set to square', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Avatar appearance="square" size="medium" />)).toHaveStyleRule(
    'border-radius',
    '3px',
  );
});
