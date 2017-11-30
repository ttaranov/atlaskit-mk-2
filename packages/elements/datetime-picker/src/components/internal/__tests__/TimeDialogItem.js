// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Item } from '@atlaskit/droplist';
import { name } from '../../../../package.json';
import TimeDialogItem from '../TimeDialogItem';

describe(name, () => {
  describe('TimeDialogItem', () => {
    it('should render a Droplist Item', () => {
      const value = 'test-value';
      const isFocused = true;
      const wrapper = shallow(<TimeDialogItem value={value} isFocused={isFocused} />);

      expect(wrapper.find(Item)).toHaveLength(1);
      expect(wrapper.find(Item).props().type).toBe('option');
      expect(wrapper.find(Item).children().text()).toBe(value);
    });

    it('should call onSelect with the value when the Item is activated', () => {
      const value = 'test-value';
      const onSelectMock = jest.fn();
      const wrapper = shallow(<TimeDialogItem value={value} onSelect={onSelectMock} />);

      wrapper.find(Item).props().onActivate();

      expect(onSelectMock.mock.calls).toHaveLength(1);
      expect(onSelectMock.mock.calls[0][0]).toBe(value);
    });
  });
});
