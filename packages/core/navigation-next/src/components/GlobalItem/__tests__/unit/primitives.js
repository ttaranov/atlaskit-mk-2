// @flow

import { mount, shallow } from 'enzyme';
import React from 'react';
import GlobalNavigationItemPrimitive, {
  BaseGlobalNavigationItemPrimitive,
} from '../../primitives';

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

  it('should render a tooltip without text if element is selected', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        component={() => <button id="customComponent" />}
        styles={styles}
        theme={theme}
        tooltip="Test tooltip"
        isSelected
      />,
    );
    expect(wrapper.find('Tooltip').props().content).toBe(undefined);
  });

  it('should render a tooltip without text if element is active', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        component={() => <button id="customComponent" />}
        styles={styles}
        theme={theme}
        tooltip="Test tooltip"
        isActive
      />,
    );
    expect(wrapper.find('Tooltip').props().content).toBe(undefined);
  });

  it('should use cached custom component stored in memory if it receives a component', () => {
    const MyComponent = () => <button id="customComponent" />;
    const wrapper = shallow(
      <BaseGlobalNavigationItemPrimitive
        component={MyComponent}
        styles={styles}
        theme={theme}
        tooltip="Test tooltip"
      />,
    ).instance();

    expect(wrapper.CachedCustomComponent === MyComponent).toBe(true);

    const childrenComponent = wrapper.renderChildren();
    expect(childrenComponent.type()).toEqual(wrapper.CachedCustomComponent());
  });
});
