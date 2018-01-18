/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import { shallow } from 'enzyme';
import React from 'react';

import Paragraph from '../Paragraph';

test('sets background colour to currentColor by default', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Paragraph />)).toHaveStyleRule(
    'background-color',
    'currentColor',
  );
});

test('sets background colour from prop', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Paragraph color={'#FFFFFF'} />)).toHaveStyleRule(
    'background-color',
    '#FFFFFF',
  );
});
