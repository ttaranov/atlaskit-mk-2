// @flow
import { mount } from 'enzyme';
import React from 'react';
import DrawerTrigger from '../src/components/js/DrawerTrigger';
import GlobalItem from '../src/components/js/GlobalItem';

describe('<DrawerTrigger />', () => {
  describe('interacting', () => {
    it('click should call the onActivate handler', () => {
      const spy = jest.fn();
      mount(<DrawerTrigger onActivate={spy} />)
        .find(GlobalItem)
        .simulate('click');
      expect(spy).toHaveBeenCalled();
    });
    it('Enter key should call the onActivate handler', () => {
      const spy = jest.fn();
      mount(<DrawerTrigger onActivate={spy} />)
        .find(GlobalItem)
        .simulate('keydown', {
          key: 'Enter',
        });
      expect(spy).toHaveBeenCalled();
    });
  });
});
