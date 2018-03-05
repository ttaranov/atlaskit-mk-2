// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import Select from '../../src';

describe('Select', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<Select />);
    expect(wrapper).not.toBe(undefined);
  });
});
