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
  it('should render an anchor when an href prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        styles={styles}
        theme={theme}
        href="www.example.com"
      />,
    );
    const anchor = wrapper.find('a[href="www.example.com"]');
    expect(anchor).toHaveLength(1);
    expect(anchor.props()).toEqual({
      children: null,
      className: expect.any(String),
      href: 'www.example.com',
    });
  });

  it('should render a button when an onClick prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        styles={styles}
        theme={theme}
        onClick={Function.prototype}
      />,
    );
    const button = wrapper.find('button');
    expect(button).toHaveLength(1);
    expect(button.props()).toEqual({
      children: null,
      className: expect.any(String),
      onClick: expect.any(Function),
    });
  });

  it('should render a CustomComponent when a component prop is passed', () => {
    const MyComponent = ({ className, children, onClick }: any) => (
      <button className={className} onClick={onClick} id="customComponent">
        {children}
      </button>
    );
    const onClick = () => {};
    const wrapper = mount(
      <BaseGlobalNavigationItemPrimitive
        component={MyComponent}
        label="my-label"
        id="my-id"
        onClick={onClick}
        styles={styles}
        theme={theme}
      />,
    );

    const componentEl = wrapper.find(MyComponent);
    expect(componentEl).toHaveLength(1);
    expect(componentEl.props()).toEqual({
      children: null,
      className: expect.any(String),
      component: MyComponent,
      id: 'my-id',
      label: 'my-label',
      onClick,
      size: 'large',
      styles,
    });
  });

  it('should render a span if neither an href, onClick or component prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive styles={styles} theme={theme} />,
    );
    const span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.props()).toEqual({
      children: null,
      className: expect.any(String),
    });
  });

  it('should render badge and icon when badge and icon props are passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        styles={styles}
        theme={theme}
        badge={() => <div id="badge" />}
        icon={() => <div id="icon" />}
        onClick={Function.prototype}
      />,
    );
    expect(wrapper.find('#badge')).toHaveLength(1);
    expect(wrapper.find('#icon')).toHaveLength(1);
  });

  it('should render a tooltip when a tooltip prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        component={({ className, children, onClick }) => (
          <button className={className} onClick={onClick} id="customComponent">
            {children}
          </button>
        )}
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
