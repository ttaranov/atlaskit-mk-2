//@flow
import React from 'react';
import { mount } from 'enzyme';
import Status from '../src/components/Status';
//TODO:
// Add negative scenarios
// Review mount as it may not the best (render)

describe('Status ', () => {
  it('it should render the component', () => {
    const wrapper = mount(<Status />);
    expect(wrapper).not.toBeUndefined();
  });
  it('it should pass the value', () => {
    const wrapper = mount(<Status value="Hello" />);
    expect(wrapper.prop('value')).toBe('Hello');
  });
  it('it should pass the presence', () => {
    const wrapper = mount(<Status presence="busy" />);
    expect(wrapper.prop('presence')).toBe('busy');
  });
});
