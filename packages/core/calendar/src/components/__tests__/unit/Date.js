// @flow

import { shallow } from 'enzyme';
import React from 'react';
import DateComponent from '../../Date';
import { DateDiv, DateTd } from '../../../styled/Date';

const create = props => {
  const day: number = 15;
  const month: number = 1;
  const year: number = 2017;
  return shallow(
    <DateComponent month={month} year={year} {...props}>
      {day}
    </DateComponent>,
  );
};

const dummyOnClickProp = jest.fn();

test('should render the component', () => {
  expect(create()).toMatchSnapshot();
});

test('should prevent default event actions on mouse down', () => {
  const wrapper = create();
  const spy = jest.fn();
  wrapper.simulate('mousedown', {
    preventDefault: spy,
  });
  expect(spy).toHaveBeenCalled();
});

test('should not trigger onClick on mouseup', () => {
  const wrapper = create({ onClick: dummyOnClickProp });
  wrapper.find(DateTd).simulate('mouseup');
  expect(dummyOnClickProp).not.toHaveBeenCalled();
});

test('should not call onClick prop when date is disabled', () => {
  const wrapper = create({ disabled: true, onClick: dummyOnClickProp });
  wrapper.find(DateTd).simulate('click');
  expect(dummyOnClickProp).not.toHaveBeenCalled();
});

test('should call onClick prop when date is enabled (default scenario)', () => {
  const wrapper = create({ onClick: dummyOnClickProp });
  wrapper.find(DateTd).simulate('click');
  expect(dummyOnClickProp).toHaveBeenCalled();
});

test('DateDiv props', () => {
  const div = props =>
    create(props)
      .find(DateDiv)
      .props();
  expect(div()).toMatchObject({ disabled: false });
  expect(div({ disabled: true })).toMatchObject({ disabled: true });
});
