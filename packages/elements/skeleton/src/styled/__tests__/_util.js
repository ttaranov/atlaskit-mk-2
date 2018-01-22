// @flow
import { shallow } from 'enzyme';
import React, { type ComponentType } from 'react';

export const assertCorrectColors = (
  Component: ComponentType<{ color: string }>,
) => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Component />)).toHaveStyleRule(
    'background-color',
    'currentColor',
  );

  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Component color={'#FFFFFF'} />)).toHaveStyleRule(
    'background-color',
    '#FFFFFF',
  );
};

export const assertCorrectOpacity = (
  Component: ComponentType<{ color: string }>,
) => {
  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Component />)).toHaveStyleRule('opacity', '0.15');

  // $FlowFixMe - invalid intersection error.
  expect(shallow(<Component appearance="strong" />)).toHaveStyleRule(
    'opacity',
    '0.3',
  );
};
