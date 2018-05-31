//@flow
import React from 'react';
import { mount } from 'enzyme';
import Status from '../src/components/Status';

describe('Status ', () => {
  it('it should render the component', () => {
    const wrapper = mount(<Status />);
    expect(wrapper).not.toBeUndefined();
  });
});
