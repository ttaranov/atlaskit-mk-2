// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import { mount, shallow } from 'enzyme';

import TabsNav from '../src/components/TabsNav';
import { name } from '../package.json';
import { sampleTabs } from './_constants';
import { Nav, NavItem } from '../src/styled';
import { type StatelessTabs } from '../src/types';

const NOOP = () => {};
const DefaultNav = ({
  onKeyboardNav = NOOP,
  tabs = sampleTabs,
}: {
  onKeyboardNav?: Function,
  tabs?: StatelessTabs,
}) => <TabsNav onKeyboardNav={onKeyboardNav} tabs={tabs} />;

describe(name, () => {
  describe('TabsNav', () => {
    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<DefaultNav />);
        expect(wrapper).not.toBe(undefined);
      });

      it('should render a list container', () => {
        const wrapper = mount(<DefaultNav />);
        expect(wrapper.getDOMNode().nodeName).toBe('DIV');
        const navList = wrapper.find(Nav);
        expect(navList.length).toBe(1);
        expect(navList.prop('role')).toBe('tablist');
      });
    });

    describe('props', () => {
      describe('tabs prop', () => {
        it('should render a matching list item for each tab', () => {
          const wrapper = mount(<DefaultNav />);
          const items = wrapper.find(NavItem);
          expect(items).toHaveLength(sampleTabs.length);

          items.forEach((item, i) => {
            expect(item.prop('aria-posinset')).toBe(i + 1);
            expect(item.prop('aria-setsize')).toBe(sampleTabs.length);
            expect(item.prop('role')).toBe('tab');
            expect(item.prop('tabIndex')).toBe(
              sampleTabs[i].isSelected ? 0 : -1,
            );
            expect(item.prop('children')[0]).toBe(sampleTabs[i].label);

            if (sampleTabs[i].isSelected) {
              expect(item.prop('aria-selected')).toBe(sampleTabs[i].isSelected);
              expect(item.prop('isSelected')).toBe(true);
            }
          });
        });
      });

      describe('onKeyboardNav', () => {
        const keys = ['ArrowRight', 'ArrowLeft'];
        keys.forEach(key => {
          it(`is called in response to ${key} key press`, () => {
            const spy = jest.fn();
            const wrapper = shallow(
              <TabsNav onKeyboardNav={spy} tabs={sampleTabs} />,
            );
            wrapper
              .find(NavItem)
              .at(1)
              .simulate('keyDown', { key });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0]).toBe(key);
          });
        });
      });
    });
  });
});
