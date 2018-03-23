// @flow

import React from 'react';
import { mount } from 'enzyme';

import Btn from '../Btn';
import Heading from '../Heading';

const PredefinedHeading = (props: Object) => (
  <Heading month={1} year={2000} {...props} />
);

test('render', () => {
  expect(mount(<PredefinedHeading />)).toMatchSnapshot();
});

test('handleClickNext / handleClickPrev', () => {
  const mockHandleClickNext = jest.fn();
  const mockHandleClickPrev = jest.fn();
  const wrapper = mount(
    <PredefinedHeading
      handleClickNext={mockHandleClickNext}
      handleClickPrev={mockHandleClickPrev}
    />,
  );

  wrapper
    .find(Btn)
    .at(0)
    .simulate('click');
  expect(mockHandleClickPrev).toHaveBeenCalledTimes(1);

  wrapper
    .find(Btn)
    .at(1)
    .simulate('click');
  expect(mockHandleClickNext).toHaveBeenCalledTimes(1);
});
