// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Droplist from '@atlaskit/droplist';

import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import DropdownMenuStatelessWithAnalytics, {
  DropdownMenuStateless,
} from '../src/components/DropdownMenuStateless';
import DropdownItemFocusManager from '../src/components/context/DropdownItemFocusManager';

describe('dropdown menu - DropdownMenuStateless', () => {
  describe('rendering DropdownItemFocusManager', () => {
    test('should render DropdownItemFocusManager inside Droplist', () => {
      const wrapper = shallow(<DropdownMenuStateless isOpen />);
      expect(
        wrapper
          .find(Droplist)
          .find(DropdownItemFocusManager)
          .exists(),
      ).toBe(true);
    });

    ['ArrowDown', 'Enter'].forEach(triggerKey => {
      test(`should set DropdownItemFocusManager.autoFocus when opened via "${triggerKey}" key on trigger`, () => {
        const wrapper = mount(
          <DropdownMenuStateless trigger={<button className="my-trigger" />} />,
        );
        wrapper.find('.my-trigger').simulate('keydown', { key: 'ArrowDown' });
        wrapper.setProps({ isOpen: true });
        expect(wrapper.find(DropdownItemFocusManager).prop('autoFocus')).toBe(
          true,
        );
      });
    });

    test('should NOT set DropdownItemFocusManager.autoFocus when opened via click on trigger', () => {
      const wrapper = mount(
        <DropdownMenuStateless trigger={<button className="my-trigger" />} />,
      );
      wrapper.find('.my-trigger').simulate('click');
      wrapper.setProps({ isOpen: true });
      expect(wrapper.find(DropdownItemFocusManager).prop('autoFocus')).toBe(
        false,
      );
    });

    test('should call onOpenChange on trigger element click', () => {
      let buttonRef;
      const spy = jest.fn();
      const trigger = (
        <button
          ref={r => {
            buttonRef = r;
          }}
        >
          Test
        </button>
      );
      const wrapper = mount(
        <DropdownMenuStateless trigger={trigger} onOpenChange={spy} />,
      );
      wrapper.find(Droplist).simulate('click', {
        target: buttonRef,
      });
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );
    });

    test('should not call onOpenChange when trigger element is disabled', () => {
      let buttonRef;
      const spy = jest.fn();
      const trigger = (
        <button
          disabled
          ref={r => {
            buttonRef = r;
          }}
        >
          Test
        </button>
      );
      const wrapper = mount(
        <DropdownMenuStateless trigger={trigger} onOpenChange={spy} />,
      );
      wrapper.find(Droplist).simulate('click', {
        target: buttonRef,
      });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
describe('analytics - DropdownMenuStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<DropdownMenuStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'dropdown-menu',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onOpenChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <DropdownMenuStatelessWithAnalytics onOpenChange={spy} />,
    );
    wrapper.find('button').simulate('toggle');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'toggle',
      }),
    );
  });

  it('should fire an atlaskit analytics event on toggle', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <DropdownMenuStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(DropdownMenuStatelessWithAnalytics).simulate('toggle');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'toggle' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'dropdown-menu',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
