// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import FlagWithAnalytics, { Flag } from '../src/components/Flag/index';
import Container, {
  Description,
  DismissButton,
  Title,
} from '../src/components/Flag/styledFlag';

describe('Flag', () => {
  const generateFlag = extraProps => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  describe('rendering', () => {
    it('should instantiate', () => {
      const wrapper = shallow(generateFlag());
      expect(wrapper.exists()).toBe(true);
    });

    it('icon prop element should be rendered to correct location', () => {
      const wrapper = shallow(generateFlag({ icon: <span id="test-icon" /> }));
      expect(wrapper.find('#test-icon').exists()).toBe(true);
    });

    it('title prop text should be rendered to correct location', () => {
      const wrapper = shallow(generateFlag({ title: 'Oh hi!' }));
      expect(
        wrapper
          .find(Title)
          .childAt(0)
          .text(),
      ).toBe('Oh hi!');
    });
  });

  describe('description prop', () => {
    let flag;

    beforeEach(() => {
      flag = mount(generateFlag());
    });

    it('description element should not be rendered if description prop is empty', () => {
      flag.setProps({ description: '' });
      expect(flag.find(Description).exists()).toBe(false);
    });

    it('description element should not be rendered if description prop not passed', () => {
      expect(flag.find(Description).exists()).toBe(false);
    });

    it('description prop text should be rendered to correct location', () => {
      flag.setProps({ description: 'Oh hi!' });
      expect(flag.find(Description).exists()).toBe(true);
      expect(flag.find(Description).text()).toBe('Oh hi!');
    });

    it('should accept JSX in description', () => {
      flag.setProps({
        description: (
          <span>
            Check this <a href="https://google.com">link</a> out
          </span>
        ),
      });
      expect(
        flag
          .find(Description)
          .find('span > a')
          .exists(),
      ).toBe(true);
    });
  });

  describe('appearance prop', () => {
    describe('basic appearance tests', () => {
      let flag;

      beforeEach(() => {
        flag = shallow(generateFlag());
      });

      it('should default to normal appearance', () => {
        expect(flag.prop('appearance')).toBe('normal');
      });

      it('should apply supplied appearance to root element', () => {
        flag.setProps({ appearance: 'warning' });
        expect(flag.find(Container).prop('appearance')).toBe('warning');
      });
    });

    describe('non-bold (normal) appearance', () => {
      let flag;

      beforeEach(() => {
        flag = mount(generateFlag({ appearance: 'normal' }));
      });

      it('should not render dismiss icon if isDismissAllowed is false or if no onDismissed callback is provided', () => {
        expect(flag.find(CrossIcon).exists()).toBe(false);
        flag.setProps({ isDismissAllowed: true, onDismissed: null });
        expect(flag.find(CrossIcon).exists()).toBe(false);
        flag.setProps({ isDismissAllowed: false, onDismissed: () => {} });
        expect(flag.find(CrossIcon).exists()).toBe(false);
      });

      it('should render dismiss icon if isDismissAllowed', () => {
        flag.setProps({ isDismissAllowed: true, onDismissed: () => {} });
        expect(flag.find(CrossIcon).exists()).toBe(true);
      });
    });

    describe('bold appearances', () => {
      let flag;

      beforeEach(() => {
        flag = mount(
          generateFlag({ appearance: 'info', isDismissAllowed: true }),
        );
      });

      it('should default to being not expanded', () => {
        expect(flag.state('isExpanded')).toBe(false);
      });

      it('should set isExpanded to true when icon clicked', () => {
        flag.setProps({ description: 'Hello' });
        flag.find(DismissButton).simulate('click');
        expect(flag.state('isExpanded')).toBe(true);
      });

      it('should render a chevron-down icon if not expanded', () => {
        flag.setProps({ description: 'Hello' });
        expect(flag.state('isExpanded')).toBe(false);
        expect(flag.find(ChevronDownIcon).exists()).toBe(true);
      });

      it('should render a chevron-up icon if expanded', () => {
        flag.setProps({ description: 'Hello' });
        flag.setState({ isExpanded: true });
        expect(flag.find(ChevronUpIcon).exists()).toBe(true);
      });

      it('should set aria-expanded to false if not expanded', () => {
        flag.setProps({ description: 'Hello' });
        const dismissProps = flag.find(DismissButton).props();
        expect(dismissProps['aria-expanded']).toBe(false);
      });

      it('should set aria-expanded to true if expanded', () => {
        flag.setProps({ description: 'Hello' });
        flag.setState({ isExpanded: true });
        const dismissProps = flag.find(DismissButton).props();
        expect(dismissProps['aria-expanded']).toBe(true);
      });

      it('should only render an expand button if either description or actions props are set', () => {
        expect(flag.find(DismissButton).exists()).toBe(false);

        flag.setProps({ actions: [], description: 'Hello' });
        expect(flag.find(DismissButton).exists()).toBe(true);

        flag.setProps({
          actions: [{ content: 'Hello', onClick: () => {} }],
          description: null,
        });
        expect(flag.find(DismissButton).exists()).toBe(true);
      });

      it('should un-expand an expanded bold flag when the description and actions props are removed', () => {
        flag.setProps({
          description: 'Hello',
          actions: [{ content: 'Hello', onClick: () => {} }],
        });
        expect(flag.state('isExpanded')).toBe(false);
        flag.find(DismissButton).simulate('click');
        expect(flag.state('isExpanded')).toBe(true);

        flag.setProps({ description: 'Hello', actions: [] });
        expect(flag.state('isExpanded')).toBe(true);

        flag.setProps({ description: null, actions: [] });
        expect(flag.state('isExpanded')).toBe(false);
      });
    });

    describe('flag actions', () => {
      it('onDismissed should be called with flag id as param when dismiss icon clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(
          generateFlag({
            id: 'a',
            isDismissAllowed: true,
            onDismissed: spy,
          }),
        );
        wrapper.find(DismissButton).simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('a');
      });

      it('Dismiss button should not be rendered if isDismissAllowed is omitted', () => {
        const spy = jest.fn();
        const wrapper = mount(
          generateFlag({
            id: 'a',
            onDismissed: spy,
          }),
        );
        expect(wrapper.find(DismissButton).exists()).toBe(false);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
describe('analytics - Flag', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<FlagWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'flag',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onBlur handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FlagWithAnalytics onBlur={spy} />);
    wrapper.find('button').simulate('blur');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'blur',
      }),
    );
  });

  it('should pass analytics event as last argument to onDismissed handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FlagWithAnalytics onDismissed={spy} />);
    wrapper.find('button').simulate('dismiss');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'dismiss',
      }),
    );
  });

  it('should pass analytics event as last argument to onFocus handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FlagWithAnalytics onFocus={spy} />);
    wrapper.find('button').simulate('focus');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'focus',
      }),
    );
  });

  it('should pass analytics event as last argument to onMouseOut handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FlagWithAnalytics onMouseOut={spy} />);
    wrapper.find('button').simulate('mouseout');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'mouseout',
      }),
    );
  });

  it('should pass analytics event as last argument to onMouseOver handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<FlagWithAnalytics onMouseOver={spy} />);
    wrapper.find('button').simulate('mouseover');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'mouseover',
      }),
    );
  });

  it('should fire an atlaskit analytics event on blur', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FlagWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FlagWithAnalytics).simulate('blur');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'blur' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'flag',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on dismiss', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FlagWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FlagWithAnalytics).simulate('dismiss');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'dismiss' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'flag',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on focus', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FlagWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FlagWithAnalytics).simulate('focus');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'focus' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'flag',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on mouseout', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FlagWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FlagWithAnalytics).simulate('mouseout');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'mouseout' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'flag',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on mouseover', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FlagWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FlagWithAnalytics).simulate('mouseover');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'mouseover' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'flag',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
