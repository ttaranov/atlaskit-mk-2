// @flow

import React from 'react';
import { mount } from 'enzyme';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';

import Checkbox, { CheckboxGroup } from '../../';
import CheckboxStatelessWithAnalytics, {
  CheckboxStatelessWithoutAnalytics as CheckboxStateless,
} from '../../CheckboxStateless';
import { HiddenCheckbox } from '../../styled/Checkbox';
import { name } from '../../../package.json';

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
      expect(cb.find('input[checked]').length === 1).toBe(true);
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
      mount(
        <div>
          <CheckboxStateless
            ref={spy}
            label=""
            isChecked
            onChange={() => {}}
            name="stub"
            value="stub value"
          />
        </div>,
      );
      expect(spy).toHaveBeenCalled();
      const [instance] = spy.mock.calls[0];
      expect(instance).toBeInstanceOf(CheckboxStateless);
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

describe('CheckboxStatelessWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(
      <CheckboxStatelessWithAnalytics
        label=""
        isChecked
        onChange={() => {}}
        name="stub"
        value="stub value"
      />,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
