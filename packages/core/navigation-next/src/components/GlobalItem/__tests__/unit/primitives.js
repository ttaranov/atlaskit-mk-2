// @flow

import { mount, shallow } from 'enzyme';
import React from 'react';
import GlobalNavigationItemPrimitive from '../../primitives';

const theme = {
  mode: {
    globalItem: Function.prototype,
  },
};
const styles = () => ({
  itemBase: {},
});

describe('GlobalNavigationItemPrimitive', () => {
  it('should render an anchor', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        styles={styles}
        theme={theme}
        href="www.example.com"
      />,
    );
    expect(wrapper.find('a[href="www.example.com"]').length).toBe(1);
  });

  it('should render a button', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        styles={styles}
        theme={theme}
        onClick={Function.prototype}
      />,
    );
    expect(wrapper.find('button').length).toBe(1);
  });

  it('should render a span', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive styles={styles} theme={theme} />,
    );
    expect(wrapper.find('span').length).toBe(1);
  });

  it('should render a CustomComponent', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        component={() => <button id="customComponent" />}
        styles={styles}
        theme={theme}
      />,
    );
    expect(wrapper.find('#customComponent').length).toBe(1);
  });

  it('should render badge and icon', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        styles={styles}
        theme={theme}
        badge={() => <div id="badge" />}
        icon={() => <div id="icon" />}
        onClick={Function.prototype}
      />,
    );
    expect(wrapper.find('#badge').length).toBe(1);
    expect(wrapper.find('#icon').length).toBe(1);
  });

  it('should render a tooltip', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        component={() => <button id="customComponent" />}
        styles={styles}
        theme={theme}
        tooltip="Test tooltip"
      />,
    );
    expect(wrapper.find('Tooltip').length).toBe(1);
  });
});
