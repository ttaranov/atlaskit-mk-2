// @flow

import React from 'react';
import { mount } from 'enzyme';

import { DropdownItem, DropdownItemGroup } from '../src';
import DropdownItemFocusManager from '../src/components/context/DropdownItemFocusManager';
import { KEY_UP, KEY_DOWN } from '../src/util/keys';

// Need this as docuement.activeElement can be null
function getDocumentActiveElementTextContent() {
  return document.activeElement && document.activeElement.textContent;
}

describe('dropdown menu - DropdownItemFocusManager', () => {
  describe('without DropdownGroup', () => {
    let wrapper;
    let items;
    let getItem;
    let pressKey;
    let isItemFocused;

    beforeEach(() => {
      wrapper = mount(
        <DropdownItemFocusManager autoFocus>
          <DropdownItem isDisabled>Item zero</DropdownItem>
          <DropdownItem isHidden>Item one</DropdownItem>
          <DropdownItem>Item two</DropdownItem>
          <DropdownItem isDisabled>Item three</DropdownItem>
          <DropdownItem isHidden>Item four</DropdownItem>
          <DropdownItem>Item five</DropdownItem>
          <DropdownItem>Item six</DropdownItem>
        </DropdownItemFocusManager>,
      );
      items = wrapper.find(DropdownItem);
      getItem = idx => items.at(idx);
      pressKey = key =>
        wrapper.instance().handleKeyboard({
          key,
          preventDefault: () => {},
        });
      isItemFocused = idx => wrapper.instance().focusedItemIndex() === idx;
    });

    test('should focus on non-disabled first item registered', () => {
      expect(isItemFocused(0)).toBe(true);
      expect(isItemFocused(1)).toBe(false);
      expect(getDocumentActiveElementTextContent()).toBe('Item two');
    });

    test('should track item focus of child items', () => {
      expect(isItemFocused(0)).toBe(true);

      getItem(5).simulate('focus');
      expect(isItemFocused(1)).toBe(true);
    });

    test('should move to next item when key down pressed', () => {
      getItem(5).simulate('focus');
      pressKey(KEY_DOWN);
      expect(getDocumentActiveElementTextContent()).toBe('Item six');
    });

    test('should move to previous item when key up pressed', () => {
      getItem(6).simulate('focus');
      pressKey(KEY_UP);
      expect(getDocumentActiveElementTextContent()).toBe('Item five');
    });

    test('should stay at first item when key up pressed on first item', () => {
      getItem(2).simulate('focus');
      pressKey(KEY_UP);
      expect(getDocumentActiveElementTextContent()).toBe('Item two');
    });

    test('should stay at last item when key up pressed on last item', () => {
      getItem(6).simulate('focus');
      pressKey(KEY_DOWN);
      expect(getDocumentActiveElementTextContent()).toBe('Item six');
    });
  });

  describe('when opened with mouse', () => {
    it('should not focus on first item', () => {
      const wrapper = mount(
        <DropdownItemFocusManager>
          <DropdownItemGroup>
            <DropdownItem isDisabled>Item zero</DropdownItem>
            <DropdownItem isHidden>Item one</DropdownItem>
            <DropdownItem>Item two</DropdownItem>
            <DropdownItem>Item three</DropdownItem>
            <DropdownItem isDisabled>Item four</DropdownItem>
            <DropdownItem isHidden>Item five</DropdownItem>
          </DropdownItemGroup>
          <DropdownItem>Item six</DropdownItem>
        </DropdownItemFocusManager>,
      );
      expect(wrapper.instance().focusedItemIndex()).toBe(-1);
    });
  });

  describe('with DropdownItemGroup', () => {
    let wrapper;
    let items;
    let getItem;
    let pressKey;
    let isItemFocused;

    beforeEach(() => {
      wrapper = mount(
        <DropdownItemFocusManager autoFocus>
          <DropdownItemGroup>
            <DropdownItem isDisabled>Item zero</DropdownItem>
            <DropdownItem isHidden>Item one</DropdownItem>
            <DropdownItem>Item two</DropdownItem>
            <DropdownItem>Item three</DropdownItem>
            <DropdownItem isDisabled>Item four</DropdownItem>
            <DropdownItem isHidden>Item five</DropdownItem>
          </DropdownItemGroup>
          <DropdownItem>Item six</DropdownItem>
        </DropdownItemFocusManager>,
      );
      items = wrapper.find(DropdownItem);
      getItem = idx => items.at(idx);
      pressKey = key =>
        wrapper.instance().handleKeyboard({
          key,
          preventDefault: () => {},
        });
      isItemFocused = idx => wrapper.instance().focusedItemIndex() === idx;
    });

    test('should focus on non-disabled first item registered', () => {
      expect(isItemFocused(0)).toBe(true);
      expect(isItemFocused(1)).toBe(false);
      expect(getDocumentActiveElementTextContent()).toBe('Item two');
    });

    test('should track item focus of child items', () => {
      getItem(2).simulate('focus');
      expect(isItemFocused(0)).toBe(true);

      getItem(3).simulate('focus');
      expect(isItemFocused(1)).toBe(true);
    });

    test('should move to next item when key down pressed', () => {
      getItem(2).simulate('focus');
      pressKey(KEY_DOWN);
      expect(getDocumentActiveElementTextContent()).toBe('Item three');
    });

    test('should move to previous item when key up pressed', () => {
      getItem(3).simulate('focus');
      pressKey(KEY_UP);
      expect(getDocumentActiveElementTextContent()).toBe('Item two');
    });

    test('should stay at first item when key up pressed on first item', () => {
      getItem(2).simulate('focus');
      pressKey(KEY_UP);
      expect(getDocumentActiveElementTextContent()).toBe('Item two');
    });

    test('should stay at last item when key up pressed on last item', () => {
      getItem(6).simulate('focus');
      pressKey(KEY_DOWN);
      expect(getDocumentActiveElementTextContent()).toBe('Item six');
    });

    test('should ignore hidden and disabled items', () => {
      getItem(3).simulate('focus');
      pressKey(KEY_DOWN);
      expect(getDocumentActiveElementTextContent()).toBe('Item six');
    });
  });
});
