// @flow

import React from 'react';
import { mount } from 'enzyme';

import Btn from '../Btn';

test('children', () => {
  expect(mount(<Btn />)).toMatchSnapshot();
  expect(mount(<Btn>children</Btn>)).toMatchSnapshot();
});

test('onClick', () => {
  const mockOnClick = jest.fn();
  const wrapper = mount(<Btn onClick={mockOnClick} />);
  wrapper.simulate('click');
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
