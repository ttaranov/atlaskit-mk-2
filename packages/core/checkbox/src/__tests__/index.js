// @flow

import React from 'react';
import { mount } from 'enzyme';
import { colors } from '@atlaskit/theme';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';

import Checkbox, { CheckboxStateless, CheckboxGroup } from '../';
import { CheckboxStatelessBase } from '../CheckboxStateless';
import { HiddenCheckbox } from '../../src/styled/Checkbox';
import { name } from '../../package.json';

describe(name, () => {
  describe('<CheckboxStateless />', () => {
    const mountStatelessCheckbox = (overridingProps: any) =>
      mount(
        <CheckboxStateless
          label=""
          isChecked
          onChange={() => {}}
          name="stub"
          value="stub value"
          {...overridingProps}
        />,
      );

    it('should be unchecked by default', () => {
      const cb = mountStatelessCheckbox({ isChecked: false });
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N40A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should have correct checked styles', () => {
      const cb = mountStatelessCheckbox({ isChecked: true });
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B400);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.N0);
    });
    it('should be correctly styled disabled', () => {
      const cb = mountStatelessCheckbox({ isChecked: false, isDisabled: true });
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N20A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should be correctly styled when hovered', () => {
      const cb = mountStatelessCheckbox({ isChecked: false });
      cb.simulate('mouseenter');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N50A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should be correctly styled when hovered and checked', () => {
      const cb = mountStatelessCheckbox({ isChecked: true });
      cb.simulate('mouseenter');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B300);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.N0);
    });
    it('should be base state if mouseenter then mouseleave', () => {
      const cb = mountStatelessCheckbox({ isChecked: true });
      cb.simulate('mouseenter');
      cb.simulate('mouseleave');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B400);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.N0);
    });
    it('should be active if mousedown and checked', () => {
      const cb = mountStatelessCheckbox({ isChecked: true });
      cb.simulate('mousedown');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B75);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.B400);
    });
    it('should be active if mousedown and unchecked', () => {
      const cb = mountStatelessCheckbox({ isChecked: false });
      cb.simulate('mousedown');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B75);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should not be active if mousedown and disabled', () => {
      const cb = mountStatelessCheckbox({ isChecked: false, isDisabled: true });
      cb.simulate('mousedown');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N20A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should call onchange on change', () => {
      const myMock = jest.fn();
      const cb = mountStatelessCheckbox({ isChecked: false, onChange: myMock });
      cb.find(HiddenCheckbox).simulate('change', { target: { checked: true } });
      expect(cb.find('CheckboxStateless').prop('isChecked')).toBe(false);
      expect(myMock.mock.calls.length).toBe(1);
    });
    it('should show indeterminate icon when indeterminate', () => {
      const cb = mountStatelessCheckbox({
        isChecked: false,
        isIndeterminate: true,
      });
      expect(cb.find(CheckboxIcon)).toHaveLength(0);
      expect(cb.find(CheckboxIndeterminateIcon)).toHaveLength(1);
    });
    it('should initially set the indeterminate state on the hidden checkbox', () => {
      const cb = mountStatelessCheckbox({
        isChecked: false,
        isIndeterminate: true,
      });
      const element = cb.find('CheckboxStateless').instance().checkbox;
      expect(element.indeterminate).toBe(true);
    });
    it('should set the indeterminate state on the hidden checkbox on update', () => {
      const cb = mountStatelessCheckbox({
        isChecked: false,
        isIndeterminate: false,
      });

      const element = cb.find('CheckboxStateless').instance().checkbox;
      expect(element.indeterminate).toBe(false);

      cb.setProps({ isIndeterminate: true });
      expect(element.indeterminate).toBe(true);
    });
    it('should have ref to CheckboxStateless class', () => {
      const spy = jest.fn();
      mount(<CheckboxStateless ref={spy} />);
      expect(spy).toHaveBeenCalled();
      const [instance] = spy.mock.calls[0];
      expect(instance).toBeInstanceOf(CheckboxStatelessBase);
    });
  });
  describe('<Checkbox />', () => {
    it('should render initiallyChecked', () => {
      const cb = mount(
        <Checkbox label="" name="stub" value="stub value" initiallyChecked />,
      );
      expect(cb.find('CheckboxStateless').prop('isChecked')).toBe(true);
    });
    it('should render initiallyChecked={false}', () => {
      const cb = mount(<Checkbox label="" name="stub" value="stub value" />);
      expect(cb.find('CheckboxStateless').prop('isChecked')).toBe(false);
    });
  });
  describe('<CheckboxGroup />', () => {
    it('sanity check for CheckboxGroup', () => {
      const cb = mount(
        <CheckboxGroup>
          <Checkbox label="" name="stub" value="stub value" />
          <Checkbox label="" name="stub2" value="stub value2" />
          <Checkbox label="" name="stub3" value="stub value3" />
          <Checkbox label="" name="stub4" value="stub value4" />
        </CheckboxGroup>,
      );
      expect(cb.find(Checkbox).length).toBe(4);
    });
  });
});
