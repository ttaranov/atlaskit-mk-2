import React, { Component } from 'react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

import { withAnalyticsEvents, withAnalyticsContext, AnalyticsContext } from '@atlaskit/analytics-next';
import { name, version } from '../../package.json';

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
describe('analytics', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<Button />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'button',
      package: name,
      version,
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
});