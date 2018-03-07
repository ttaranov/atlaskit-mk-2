// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { Input } from '../../src/styled';

import ToggleStatelessWithAnalytics, {
  ToggleStateless,
} from '../ToggleStateless';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

describe('ToggleStateless', () => {
  describe('properties', () => {
    it('should set the correct icons when checked', () => {
      const wrapper = mount(<ToggleStateless isChecked />);
      expect(wrapper.find(Input).prop('checked')).toBe(true);
      expect(wrapper.find(ConfirmIcon).exists()).toBe(true);
      expect(wrapper.find(CloseIcon).exists()).toBe(false);
    });

    it('should set the correct icons when not checked', () => {
      const wrapper = mount(<ToggleStateless />);
      expect(wrapper.find(Input).prop('checked')).toBe(false);
      expect(wrapper.find(ConfirmIcon).exists()).toBe(false);
      expect(wrapper.find(CloseIcon).exists()).toBe(true);
    });

    it('should disable the input when disabled', () => {
      const wrapper = mount(<ToggleStateless isDisabled />);
      expect(wrapper.find(Input).prop('disabled')).toBe(true);
    });

    it('should not disabled the input when not disabled', () => {
      const wrapper = mount(<ToggleStateless />);
      expect(wrapper.find(Input).prop('disabled')).toBe(false);
    });

    describe('input events handlers', () => {
      ['change', 'focus', 'blur'].forEach((eventName: string) => {
        it(`should trigger event handlers for ${eventName}`, () => {
          const spy = jest.fn();
          const props = { [`on${capitalize(eventName)}`]: spy };
          const wrapper = mount(<ToggleStateless {...props} />);
          wrapper.find(Input).simulate(eventName);
          expect(spy).toHaveBeenCalled();
        });
      });

      ['focus', 'blur'].forEach((eventName: string) => {
        it('should fire input focus related input handler when disabled', () => {
          const spy = jest.fn();
          const props = { [`on${capitalize(eventName)}`]: spy };
          const wrapper = mount(<ToggleStateless isDisabled {...props} />);

          wrapper.find(Input).simulate(eventName);

          expect(spy).toHaveBeenCalled();
        });
      });

      it('should not fire change events when disabled', () => {
        const spy = jest.fn();
        const props = { onChange: spy };
        const wrapper = mount(<ToggleStateless isDisabled {...props} />);

        wrapper.find(Input).simulate('change');

        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
describe('analytics - Toggle', () => {});
describe('analytics - ToggleStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<ToggleStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'toggle',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onBlur handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<ToggleStatelessWithAnalytics onBlur={spy} />);
    wrapper.find('button').simulate('blur');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'blur',
      }),
    );
  });

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<ToggleStatelessWithAnalytics onChange={spy} />);
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should pass analytics event as last argument to onFocus handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<ToggleStatelessWithAnalytics onFocus={spy} />);
    wrapper.find('button').simulate('focus');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'focus',
      }),
    );
  });

  it('should fire an atlaskit analytics event on blur', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <ToggleStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(ToggleStatelessWithAnalytics).simulate('blur');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'blur' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'toggle',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <ToggleStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(ToggleStatelessWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'toggle',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on focus', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <ToggleStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(ToggleStatelessWithAnalytics).simulate('focus');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'focus' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'toggle',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
