// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import { parse } from 'date-fns';
import cases from 'jest-in-case';

import Calendar from '../Calendar';
import Date from '../Date';
import { DateTd } from '../../styled/Date';

function createEvent(opts: Object = {}): Object {
  return {
    ...opts,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  };
}

function createEventData(iso, mix = {}) {
  const parsed = parse(iso);
  return {
    day: parsed.getDate(),
    month: parsed.getMonth() + 1,
    year: parsed.getFullYear(),
    iso,
    ...mix,
  };
}

test('getNextMonth() / getPrevMonth()', () => {
  const wrapper = shallow(<Calendar month={1} year={2000} />);
  expect(wrapper.instance().getNextMonth()).toEqual({ month: 2, year: 2000 });
  expect(wrapper.instance().getPrevMonth()).toEqual({ month: 12, year: 1999 });
});

cases(
  'handleContainerKeyDown() calls navigate()',
  ({ name, key }) => {
    const i = shallow(<Calendar />).instance();
    i.navigate = jest.fn();
    i.handleContainerKeyDown(createEvent({ key }));
    expect(i.navigate).toHaveBeenCalledWith(name);
  },
  [
    { name: 'down', key: 'ArrowDown' },
    { name: 'left', key: 'ArrowLeft' },
    { name: 'right', key: 'ArrowRight' },
    { name: 'up', key: 'ArrowUp' },
  ],
);

cases(
  'handleContainerKeyDown() - "Arrow*"',
  ({ iso, name, type }) => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(
      <Calendar onChange={mockOnChange} month={1} year={2000} />,
    );
    const container = wrapper.first();

    const e = createEvent({ key: name });
    container.simulate('keydown', e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(createEventData(iso, { type }));
  },
  [
    { iso: '2000-01-07', name: 'ArrowDown', type: 'down' },
    { iso: '1999-12-31', name: 'ArrowLeft', type: 'left' },
    { iso: '2000-01-01', name: 'ArrowRight', type: 'right' },
    { iso: '1999-12-24', name: 'ArrowUp', type: 'up' },
  ],
);

cases(
  'handleContainerKeyDown() - "Enter" / " "',
  ({ key }) => {
    const mock = jest.fn();
    const wrapper = shallow(
      <Calendar onSelect={mock} day={1} month={1} year={2000} />,
    );
    const container = wrapper.first();

    const e = createEvent({ key });
    container.simulate('keydown', e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledWith(createEventData('2000-01-01'));
  },
  [{ name: 'Enter', key: 'Enter' }, { name: 'Space', key: ' ' }],
);

test('handleClickDay()', () => {
  const mockOnSelect = jest.fn();
  const wrapper = mount(
    <Calendar onSelect={mockOnSelect} month={1} year={2000} />,
  );
  wrapper
    .find(Date)
    .filter({ children: 1, month: 1, year: 2000 })
    .find(DateTd)
    .simulate('mouseup', createEvent());
  expect(mockOnSelect).toHaveBeenCalledWith(createEventData('2000-01-01'));
});

test('handleClickNext()', () => {});

test('handleClickPrev()', () => {});

test('handleContainerBlur()', () => {});

test('handleContainerFocus()', () => {});

test('focus()', () => {});
