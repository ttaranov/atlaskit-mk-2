// @flow
import React from 'react';
import { mount } from 'enzyme';
import CreateRoom from '../src/components/CreateRoom';
import EditRoom from '../src/components/EditRoom';
// TODO: Add more relevant tests
// Check what the children is passing
// Check props actions, header, body

describe('Create Room ', () => {
  it('it should render the component', () => {
    const wrapper = mount(<CreateRoom onClose={() => {}} />);
    expect(wrapper).not.toBeUndefined();
  });
  it('it should pass children ', () => {
    const wrapper = mount(<CreateRoom onClose={() => {}} />);
    expect(wrapper.prop('children')).not.toBeUndefined();
  });
});

describe('Edit Room ', () => {
  it('it should render the component', () => {
    const wrapper = mount(<EditRoom onClose={() => {}} />);
    expect(wrapper).not.toBeUndefined();
  });
  it('it should pass children ', () => {
    const wrapper = mount(<EditRoom onClose={() => {}} />);
    expect(wrapper.prop('children')).not.toBeUndefined();
  });
});
