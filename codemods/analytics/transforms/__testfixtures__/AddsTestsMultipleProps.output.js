import { mount, shallow } from 'enzyme';
import React, { Component } from 'react';
import { AnalyticsListener, AnalyticsContext, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import { name as packageName, version as packageVersion } from '../../package.json';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

describe('ak-button/default-behaviour', () => {
  it('button should have type="button" by default', () =>
    expect(
      mount(<Button />)
        .find(ButtonBase)
        .props().type,
    ).toBe('button'));
});
describe('analytics - Button', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<Button />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'button',
      package: packageName,
      version: packageVersion
    });
  });

  it('should pass analytics event as last argument to onClick handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<Button onClick={spy} />);
    wrapper.find('button').simulate('click');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'click',
      }),
    );
  });

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<Button onChange={spy} />);
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should fire an atlaskit analytics event on click', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <Button />
      </AnalyticsListener>,
    );

    wrapper.find(Button).simulate('click');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'click' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'button',
        package: packageName,
        version: packageVersion
      },
    ]);
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <Button />
      </AnalyticsListener>,
    );

    wrapper.find(Button).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'button',
        package: packageName,
        version: packageVersion
      },
    ]);
  });
});