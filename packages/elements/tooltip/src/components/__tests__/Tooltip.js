// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import Tooltip from '../../../src';

describe('Tooltip', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<Tooltip />);
    expect(wrapper).not.toBe(undefined);
  });
});
