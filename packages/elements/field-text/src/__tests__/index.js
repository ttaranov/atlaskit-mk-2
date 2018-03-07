// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Base from '@atlaskit/field-base';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import FieldText from '../../src';
import Input from '../../src/styled/Input';

import FieldTextStatelessWithAnalytics, {
  FieldTextStateless,
} from '../FieldTextStateless';

describe('FieldTextStateless', () => {
  // Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  it('defaults', () => {
    const wrapper = shallow(<FieldTextStateless label="" />);
    expect(wrapper.find(Base).length).toBe(1);
    expect(wrapper.find(Input).length).toBe(1);
  });

  describe('properties', () => {
    describe('compact prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" compact />)
            .find(Base)
            .props().isCompact,
        ).toBe(true);
      });
    });

    describe('disabled prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" disabled />)
            .find(Base)
            .props().isDisabled,
        ).toBe(true);
      });
    });

    describe('isReadOnly prop', () => {
      describe('set to true', () => {
        it('should sets its value on the input', () => {
          expect(
            mount(<FieldText label="" isReadOnly />)
              .find('input')
              .props().readOnly,
          ).toBe(true);
        });

        it('should reflect its value to the FieldBase', () => {
          expect(
            mount(<FieldText label="" isReadOnly />)
              .find(Base)
              .props().isReadOnly,
          ).toBe(true);
        });
      });

      describe('set to false', () => {
        it('should sets its value on the input', () => {
          expect(
            mount(<FieldText label="" />)
              .find('input')
              .props().readOnly,
          ).toBe(false);
        });

        it('should reflect its value to the FieldBase', () => {
          expect(
            mount(<FieldText label="" />)
              .find(Base)
              .props().isReadOnly,
          ).toBe(false);
        });
      });
    });

    describe('required prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" required />)
            .find(Base)
            .props().isRequired,
        ).toBe(true);
      });
    });

    describe('isInvalid prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" isInvalid />)
            .find(Base)
            .props().isInvalid,
        ).toBe(true);
      });
    });

    describe('spellCheck prop', () => {
      it('should render an input with a spellCheck prop', () => {
        expect(
          shallow(<FieldTextStateless label="" isSpellCheckEnabled />)
            .find(Input)
            .props().spellCheck,
        ).toBe(true);
      });
    });

    describe('invalidMessage prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" invalidMessage="test" />)
            .find(Base)
            .props().invalidMessage,
        ).toBe('test');
      });
    });

    describe('native input attributes should be reflected to input element', () => {
      [
        ['type', 'search'],
        ['disabled', true],
        ['name', 'test'],
        ['placeholder', 'test placeholder'],
        ['maxLength', 5],
        ['min', 1],
        ['max', 10],
        ['required', true],
        ['autoComplete', 'on'],
        ['form', 'my-form'],
        ['pattern', '/.+/'],
      ].forEach(([prop, propValue]) => {
        it(prop, () => {
          expect(
            shallow(<FieldTextStateless label="" {...{ [prop]: propValue }} />)
              .find(Input)
              .prop(prop),
          ).toBe(propValue);
        });
      });
    });

    describe('native input events', () => {
      [
        'onBlur',
        'onChange',
        'onFocus',
        'onKeyDown',
        'onKeyPress',
        'onKeyUp',
      ].forEach(inputEvent => {
        it(inputEvent, () => {
          const eventSpy = jest.fn();
          const wrapper = shallow(
            <FieldTextStateless label="" {...{ [inputEvent]: eventSpy }} />,
          );
          const input = wrapper.find(Input);
          expect(input.prop(inputEvent)).toBe(eventSpy);

          const simulateEvent = inputEvent.replace(/^on/, '').toLowerCase();
          input.simulate(simulateEvent);

          expect(eventSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('Input should have value="something"', () =>
      expect(
        shallow(<FieldTextStateless label="" value="something" />)
          .find(Input)
          .prop('value'),
      ).toBe('something'));

    it('onChange should be called when input value changes', () => {
      const spy = jest.fn();
      const wrapper = mount(<FieldTextStateless label="" onChange={spy} />);
      wrapper.find(Input).simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('FieldText', () => {
    it('should call onChange when input value changes', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <FieldText label="" value="something" onChange={spy} />,
      );
      wrapper.find(Input).simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('FieldText input focus', () => {
    it('should get focus when focus() is called', () => {
      const focusSpy = jest.fn();
      const wrapper = mount(<FieldText label="" onFocus={focusSpy} />);

      // The onFocus prop doesn't actualy get fired by enzyme for some reason, so attaching
      // the spy directly to the input.
      wrapper
        .find('input')
        .getDOMNode()
        .addEventListener('focus', focusSpy);

      expect(focusSpy).toHaveBeenCalledTimes(0);
      wrapper.instance().focus();
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
  });
});
describe('analytics - FieldTextStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<FieldTextStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'field-text',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onBlur handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FieldTextStatelessWithAnalytics onBlur={spy} />);
    wrapper.find('button').simulate('blur');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'blur',
      }),
    );
  });

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FieldTextStatelessWithAnalytics onChange={spy} />);
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should pass analytics event as last argument to onFocus handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FieldTextStatelessWithAnalytics onFocus={spy} />);
    wrapper.find('button').simulate('focus');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'focus',
      }),
    );
  });

  it('should pass analytics event as last argument to onKeyDown handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FieldTextStatelessWithAnalytics onKeyDown={spy} />);
    wrapper.find('button').simulate('keydown');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'keydown',
      }),
    );
  });

  it('should pass analytics event as last argument to onKeyPress handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FieldTextStatelessWithAnalytics onKeyPress={spy} />);
    wrapper.find('button').simulate('keypress');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'keypress',
      }),
    );
  });

  it('should pass analytics event as last argument to onKeyUp handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FieldTextStatelessWithAnalytics onKeyUp={spy} />);
    wrapper.find('button').simulate('keyup');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'keyup',
      }),
    );
  });

  it('should fire an atlaskit analytics event on blur', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldTextStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldTextStatelessWithAnalytics).simulate('blur');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'blur' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-text',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldTextStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldTextStatelessWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-text',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on focus', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldTextStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldTextStatelessWithAnalytics).simulate('focus');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'focus' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-text',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on keydown', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldTextStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldTextStatelessWithAnalytics).simulate('keydown');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'keydown' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-text',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on keypress', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldTextStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldTextStatelessWithAnalytics).simulate('keypress');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'keypress' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-text',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on keyup', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldTextStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldTextStatelessWithAnalytics).simulate('keyup');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'keyup' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-text',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
