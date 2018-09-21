// @flow

import React from 'react';
import { mount } from 'enzyme';

import Group from '../../index';

const defaultProps = {
  hasSeparator: true,
  id: 'group-id',
  heading: 'Group heading',
};

describe('NavigationNext: Group', () => {
  it('should render the given heading', () => {
    const wrapper = mount(
      <Group {...defaultProps}>
        <p>component content</p>
      </Group>,
    );
    expect(wrapper.find('GroupHeading').text()).toBe(defaultProps.heading);
  });

  it('should NOT render the given heading if is `null`', () => {
    const props = { ...defaultProps, heading: null };
    const wrapper = mount(
      <Group {...props}>
        <p>component content</p>
      </Group>,
    );
    expect(wrapper.find('GroupHeading').length).toBe(0);
  });

  it('should render separator if `hasSeparator` is true', () => {
    const wrapper = mount(
      <Group {...defaultProps}>
        <p>component content</p>
      </Group>,
    );
    expect(wrapper.find('Separator').length).toBe(1);
  });

  it('should NOT render separator if `hasSeparator` is false', () => {
    const props = { ...defaultProps, hasSeparator: false };
    const wrapper = mount(
      <Group {...props}>
        <p>component content</p>
      </Group>,
    );
    expect(wrapper.find('Separator').length).toBe(0);
  });

  it('should return null if component does not have any children', () => {
    const props = { ...defaultProps, children: null };
    expect(
      mount(<Group {...props} />).find('NavigationAnalyticsContext').length,
    ).toBe(0);
  });
});
