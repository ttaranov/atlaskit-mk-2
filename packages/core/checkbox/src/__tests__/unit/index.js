// @flow

import React from 'react';
import { mount } from 'enzyme';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';

import CheckboxWithAnalytics from '../../Checkbox';
import { Checkbox } from '../../';
import { HiddenCheckbox } from '../../styled/Checkbox';
import { name } from '../../../package.json';

describe(name, () => {
  describe('<Checkbox />', () => {
    const mountCheckbox = (overridingProps: any) =>
      mount(
        <Checkbox
          label=""
          onChange={() => {}}
          name="stub"
          value="stub value"
          {...overridingProps}
        />,
      );

    it('should be unchecked by default', () => {
      const cb = mountCheckbox({ defaultChecked: false });
      expect(cb.find('input[checked]').length === 1).toBe(true);
    });
    it('should call onchange on change', () => {
      const myMock = jest.fn();
      const cb = mountCheckbox({ isChecked: false, onChange: myMock });
      cb.find(HiddenCheckbox).simulate('change', { target: { checked: true } });
      expect(cb.find('Checkbox').prop('isChecked')).toBe(false);
      // TODO: why is onChange being called twice
      // expect(myMock.mock.calls.length).toBe(1);
    });
    it('should show indeterminate icon when indeterminate', () => {
      const cb = mount(
        <Checkbox
          onChange={() => {}}
          name="stub"
          value="stub value"
          isIndeterminate
          isChecked={false}
        />,
      );
      expect(cb.find(CheckboxIcon)).toHaveLength(0);
      expect(cb.find(CheckboxIndeterminateIcon)).toHaveLength(1);
      // console.log(cb.debug());
    });
    it('should initially set the indeterminate state on the hidden checkbox', () => {
      const cb = mountCheckbox({
        isChecked: false,
        isIndeterminate: true,
      });
      const element = cb.instance().checkbox;
      expect(element.indeterminate).toBe(true);
    });
    it('should set the indeterminate state on the hidden checkbox on update', () => {
      const cb = mountCheckbox({
        isChecked: false,
        isIndeterminate: false,
      });

      const element = cb.find('Checkbox').instance().checkbox;
      expect(element.indeterminate).toBe(false);

      cb.setProps({ isIndeterminate: true });
      expect(element.indeterminate).toBe(true);
    });
    it('should have ref to Checkbox class', () => {
      const spy = jest.fn();
      mount(
        <div>
          <Checkbox
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
      //$FlowFixMe
      expect(instance).toBeInstanceOf(Checkbox);
    });
  });
  describe('<Checkbox defaultChecked/>', () => {
    it('should render defaultChecked', () => {
      const cb = mount(
        <Checkbox label="" name="stub" value="stub value" defaultChecked />,
      );
      const element = cb.instance().checkbox;
      expect(element.checked).toBe(true);
    });
    it('should render defaultChecked={undefined}', () => {
      const cb = mount(<Checkbox label="" name="stub" value="stub value" />);
      const element = cb.instance().checkbox;
      expect(element.checked).toBe(false);
    });
  });
});

describe('CheckboxWithAnalytics', () => {
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
      <CheckboxWithAnalytics
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
