// @flow

import { mount, shallow } from 'enzyme';
import React from 'react';
import DateComponent from '../Date';
import { DateDiv, DateTd } from '../../styled/Date';

const create = props => {
  const now = new Date();
  const day: number = now.getDate();
  const month: number = now.getMonth() + 1;
  const year: number = now.getFullYear();
  return shallow(
    <DateComponent month={month} year={year} {...props}>
      {day}
    </DateComponent>,
  );
};

const dummyOnClickProp = jest.fn();

test('should not call onClick prop when date is disabled', () => {
  const wrapper = create({ disabled: true, onClick: dummyOnClickProp });
  wrapper.find(DateTd).simulate('mouseup');
  expect(dummyOnClickProp).not.toHaveBeenCalled();
});

test('should call onClick prop when date is enabled (default scenario)', () => {
  const wrapper = create({ onClick: dummyOnClickProp });
  wrapper.find(DateTd).simulate('mouseup');
  expect(dummyOnClickProp).toHaveBeenCalled();
});

test('DateDiv', () => {
  const div = props =>
    create(props)
      .find(DateDiv)
      .props();
  expect(div()).toMatchObject({ disabled: false });
  expect(div({ disabled: true })).toMatchObject({ disabled: true });
});
