// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { name } from '../../../../package.json';
import DateField from '../DateField';
import Input from '../Input';

describe(name, () => {
  describe('DateField', () => {
    it('should render an Input with a default placeholder', () => {
      const wrapper = shallow(<DateField />);

      expect(wrapper.find(Input)).toHaveLength(1);
      expect(wrapper.find(Input).props().placeholder).toBe('yyyy/mm/dd');
    });

    it('should call onKeyDown and onTriggerOpen when the down arrow key is pressed', () => {
      const onKeyDownMock = jest.fn();
      const onTriggerOpenMock = jest.fn();

      const wrapper = shallow(
        <DateField
          onKeyDown={onKeyDownMock}
          onTriggerOpen={onTriggerOpenMock}
        />,
      );
      wrapper.find(Input).simulate('keyDown', { key: 'ArrowDown' });

      expect(onKeyDownMock.mock.calls.length).toBe(1);
      expect(onTriggerOpenMock.mock.calls.length).toBe(1);
    });

    it('should call onKeyDown and onTriggerValidate when the Enter key is pressed', () => {
      const onKeyDownMock = jest.fn();
      const onTriggerValidateMock = jest.fn();

      const wrapper = shallow(
        <DateField
          onKeyDown={onKeyDownMock}
          onTriggerValidate={onTriggerValidateMock}
        />,
      );
      wrapper.find(Input).simulate('keyDown', { key: 'Enter' });

      expect(onKeyDownMock.mock.calls.length).toBe(1);
      expect(onTriggerValidateMock.mock.calls.length).toBe(1);
    });

    describe('passing down props', () => {
      it('should pass autoFocus down to the underlying Input', () => {
        const wrapper = shallow(<DateField autoFocus />);
        expect(wrapper.find(Input).props().autoFocus).toBeTruthy();
      });
    });
  });
});
