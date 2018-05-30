// @flow

import React from 'react';
import { mount } from 'enzyme';
import RootItem from '../src';

describe('Room for Stride', () => {
  it('it should render the component', () => {
    const wrapper = mount(<RootItem />);
    expect(wrapper).not.toBeUndefined();
  });
  it('it should have the room name', () => {
    const wrapper = mount(<RootItem roomName="Room" />);
    expect(wrapper.prop('roomName')).toBe('Room');
  });
  it('it should have the description', () => {
    const wrapper = mount(<RootItem description="Room 1..." />);
    expect(wrapper.prop('description')).toBe('Room 1...');
  });
});
