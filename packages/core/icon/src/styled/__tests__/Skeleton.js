// @flow
import React from 'react';
import { shallow } from 'enzyme';

import Skeleton from '../Skeleton';

test('sets color as currentColor by default', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Skeleton />)).toHaveStyleRule(
    'background-color',
    'currentColor',
  );
});

test('sets color from prop', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Skeleton color={'#FFFFFF'} />)).toHaveStyleRule(
    'background-color',
    '#FFFFFF',
  );
});

test('sets a default opacity', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Skeleton />)).toHaveStyleRule('opacity', '0.15');
});

test('sets a strong opacity when prop specified', () => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Skeleton weight="strong" />)).toHaveStyleRule(
    'opacity',
    '0.3',
  );
});
