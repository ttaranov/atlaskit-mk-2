// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import Droplist from '@atlaskit/droplist';

import { DropdownMenuStateless } from '../../..';
import DropdownItemFocusManager from '../../context/DropdownItemFocusManager';

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
