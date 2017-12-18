// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { name } from '../../../../package.json';
import TimeField from '../TimeField';
import Input from '../Input';

describe(name, () => {
  describe('TimeField', () => {
    it('should render an Input with a default placeholder', () => {
      const wrapper = shallow(<TimeField />);

      expect(wrapper.find(Input)).toHaveLength(1);
      expect(wrapper.find(Input).props().placeholder).toBe('e.g. 9:00am');
    });

    it('should call onKeyDown when a key is pressed', () => {
      const onKeyDownMock = jest.fn();

      const wrapper = shallow(<TimeField onKeyDown={onKeyDownMock} />);
      wrapper.find(Input).simulate('keyDown', { key: 'ArrowDown' });

      expect(onKeyDownMock.mock.calls.length).toBe(1);
    });

    describe('passing down props', () => {
      it('should pass autoFocus down to the underlying Input', () => {
        const wrapper = shallow(<TimeField autoFocus />);
        expect(wrapper.find(Input).props().autoFocus).toBeTruthy();
      });
    });
  });
});
