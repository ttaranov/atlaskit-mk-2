// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import Droplist from '@atlaskit/droplist';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import DropdownMenuStatelessWithAnalytics, {
  DropdownMenuStatelessWithoutAnalytics as DropdownMenuStateless,
} from '../src/components/DropdownMenuStateless';
import DropdownItemFocusManager from '../src/components/context/DropdownItemFocusManager';

describe('dropdown menu - DropdownMenuStateless', () => {
  describe('rendering DropdownItemFocusManager', () => {
    test('should render DropdownItemFocusManager inside Droplist', () => {
      const wrapper = shallow(<DropdownMenuStateless isOpen />);
      expect(
        wrapper
          .find('Droplist')
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

describe('DropdownMenuStatelessWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<DropdownMenuStatelessWithAnalytics isOpen />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
  it('should override the existing analytics context of Droplist', () => {
    const wrapper = mount(<DropdownMenuStatelessWithAnalytics />);

    expect(wrapper.find(Droplist).prop('analyticsContext')).toEqual({
      componentName: 'dropdownMenu',
      package: packageName,
      version: packageVersion,
    });
  });
});
