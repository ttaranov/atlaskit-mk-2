// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import AkRadio from '../../src/Radio';
import Radio from '../../src/RadioBase';
import {
  name,
  name as packageName,
  version as packageVersion,
} from '../../package.json';

describe(name, () => {
  describe('Radio', () => {
    describe('exports', () => {
      it('the Radio component', () => {
        expect(Radio).not.toBe(undefined);
        expect(new Radio()).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<Radio onChange={() => {}} />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render an input and the content', () => {
        const content = 'content';
        const wrapper = mount(<Radio onChange={() => {}}>{content}</Radio>);
        expect(wrapper.find('input').length).toBe(1);
        expect(wrapper.text()).toBe(content);
      });

      it('should render content with markup correctly', () => {
        const content = <div>content</div>;
        const wrapper = mount(<Radio onChange={() => {}}>{content}</Radio>);
        expect(wrapper.find('input').length).toBe(1);
        expect(wrapper.contains(content)).toBe(true);
      });
    });

    describe('props', () => {
      function expectPropReflectedToInput(prop, inputProp, val) {
        it('should be reflected to the input', () => {
          const props = { [prop]: val };
          const wrapper = mount(<AkRadio onChange={() => {}} {...props} />);
          expect(wrapper.find('input').prop(inputProp)).toBe(val);
        });
      }

      describe('isDisabled prop', () => {
        expectPropReflectedToInput('isDisabled', 'disabled', true);
        expectPropReflectedToInput('isDisabled', 'disabled', false);
      });

      describe('isRequired prop', () => {
        expectPropReflectedToInput('isRequired', 'required', true);
        expectPropReflectedToInput('isRequired', 'required', false);
      });

      describe('isSelected prop', () => {
        expectPropReflectedToInput('isSelected', 'checked', true);
        expectPropReflectedToInput('isSelected', 'checked', false);
      });

      describe('name prop', () => {
        expectPropReflectedToInput('name', 'name', 'name-val');
      });

      describe('onChange prop', () => {
        // FIXME: The test below won't work anymore now that AkRadio is analytics HOCs. This has
        // been fixed in other components by exporting the non-wrapped version and testing against
        // that but that may not work due to radio needing ThemeProvider? This needs to be
        // investigated.
        //
        // const func = () => {};
        // expectPropReflectedToInput('onChange', 'onChange', func);

        it('should be reflected to the input', () => {
          const spy = jest.fn();
          const wrapper = mount(<Radio onChange={spy} />);
          wrapper.find('input').simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });

      describe('value prop', () => {
        expectPropReflectedToInput('value', 'value', 'value-val');
      });
    });
  });
});
describe('analytics - AkRadio', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<AkRadioWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'field-radio-group',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<AkRadioWithAnalytics onChange={spy} />);
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
        <AkRadioWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(AkRadioWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-radio-group',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
