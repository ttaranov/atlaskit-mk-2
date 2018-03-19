// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import { parse } from 'date-fns';
import cases from 'jest-in-case';

import Btn from '../Btn';
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
  let calendarRef;
  shallow(
    <Calendar
      month={1}
      year={2000}
      innerRef={r => {
        calendarRef = r;
      }}
    />,
  );
  expect(calendarRef).toBeTruthy();
  if (calendarRef) {
    expect(calendarRef.getNextMonth()).toEqual({ month: 2, year: 2000 });
    expect(calendarRef.getPrevMonth()).toEqual({ month: 12, year: 1999 });
  }
});

cases(
  'handleContainerKeyDown() calls navigate()',
  ({ name, key }) => {
    let calendarRef;
    shallow(
      <Calendar
        innerRef={r => {
          calendarRef = r;
        }}
      />,
    );
    expect(calendarRef).toBeTruthy();
    if (calendarRef) {
      calendarRef.navigate = jest.fn();
      calendarRef.handleContainerKeyDown(createEvent({ key }));
      expect(calendarRef.navigate).toHaveBeenCalledWith(name);
    }
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

test('handleClickNext()', () => {
  const mockOnChange = jest.fn();
  const wrapper = mount(
    <Calendar onChange={mockOnChange} day={1} month={1} year={2000} />,
  );
  wrapper
    .find(Btn)
    .at(1)
    .simulate('click', createEvent());
  expect(mockOnChange).toHaveBeenCalledWith({
    type: 'next',
    ...createEventData('2000-02-01'),
  });
});

test('handleClickPrev()', () => {
  const mockOnChange = jest.fn();
  const wrapper = mount(
    <Calendar onChange={mockOnChange} day={1} month={1} year={2000} />,
  );
  wrapper
    .find(Btn)
    .at(0)
    .simulate('click', createEvent());
  expect(mockOnChange).toHaveBeenCalledWith({
    type: 'prev',
    ...createEventData('1999-12-01'),
  });
});

test('handleContainerBlur()', () => {
  const mockOnBlur = jest.fn();
  const wrapper = mount(<Calendar onBlur={mockOnBlur} />);
  wrapper
    .find('div')
    .first()
    .simulate('blur', createEvent());
  expect(mockOnBlur).toHaveBeenCalledTimes(1);
});

test('handleContainerFocus()', () => {
  const mockOnFocus = jest.fn();
  const wrapper = mount(<Calendar onFocus={mockOnFocus} />);
  wrapper
    .find('div')
    .first()
    .simulate('focus', createEvent());
  expect(mockOnFocus).toHaveBeenCalledTimes(1);
});

test('refContainer()', () => {
  let calendarRef;
  mount(
    <Calendar
      innerRef={r => {
        calendarRef = r;
      }}
    />,
  );
  expect(calendarRef).toBeTruthy();
  if (calendarRef) {
    expect(calendarRef.container).toBeInstanceOf(HTMLDivElement);
  }
});

test('focus()', () => {
  let calendarRef;
  mount(
    <Calendar
      innerRef={r => {
        calendarRef = r;
      }}
    />,
  );
  expect(calendarRef).toBeTruthy();
  if (calendarRef) {
    calendarRef.container.focus = jest.fn();
    calendarRef.focus();
    expect(calendarRef.container.focus).toHaveBeenCalledTimes(1);
  }
});

test('innerRef', () => {
  let calendarRef;
  const wrapper = mount(
    <Calendar
      innerRef={r => {
        calendarRef = r;
      }}
    />,
  );
  expect(calendarRef).toBeInstanceOf(Calendar);
  wrapper.unmount();
  expect(calendarRef).toBe(null);
});
