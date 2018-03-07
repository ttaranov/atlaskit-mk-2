// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { colors } from '@atlaskit/theme';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';

import Checkbox, { CheckboxStateless, CheckboxGroup } from '../';
import { HiddenCheckbox } from '../../src/styled/Checkbox';
import {
  name,
  name as packageName,
  version as packageVersion,
} from '../../package.json';

describe(name, () => {
  // Helper function to generate <Flag /> with base props
  describe('<CheckboxStateless />', () => {
    it('should be unchecked by default', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked={false}
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N40A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should have correct checked styles', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B400);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.N0);
    });
    it('should be correctly styled disabled', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked={false}
          onChange={() => {}}
          name="stub"
          value="stub value"
          isDisabled
        />,
      );
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N20A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should be correctly styled when hovered', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked={false}
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      cb.simulate('mouseenter');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N50A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should be correctly styled when hovered and checked', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      cb.simulate('mouseenter');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B300);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.N0);
    });
    it('should be base state if mouseenter then mouseleave', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      cb.simulate('mouseenter');
      cb.simulate('mouseleave');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B400);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.N0);
    });
    it('should be active if mousedown and checked', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      cb.simulate('mousedown');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B75);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe(colors.B400);
    });
    it('should be active if mousedown and unchecked', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked={false}
          onChange={() => {}}
          name="stub"
          value="stub value"
        />,
      );
      cb.simulate('mousedown');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.B75);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should not be active if mousedown and disabled', () => {
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked={false}
          onChange={() => {}}
          name="stub"
          value="stub value"
          isDisabled
        />,
      );
      cb.simulate('mousedown');
      expect(cb.find(CheckboxIcon).prop('primaryColor')).toBe(colors.N20A);
      expect(cb.find(CheckboxIcon).prop('secondaryColor')).toBe('transparent');
    });
    it('should call onchange on change', () => {
      const myMock = jest.fn();
      const cb = mount(
        <CheckboxStateless
          label=""
          isChecked={false}
          onChange={myMock}
          name="stub"
          value="stub value"
        />,
      );
      cb.find(HiddenCheckbox).simulate('change', { target: { checked: true } });
      expect(cb.find('CheckboxStateless').prop('isChecked')).toBe(false);
      expect(myMock.mock.calls.length).toBe(1);
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
describe('analytics - CheckboxStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<CheckboxStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'checkbox',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<CheckboxStatelessWithAnalytics onChange={spy} />);
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <CheckboxStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(CheckboxStatelessWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'checkbox',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
