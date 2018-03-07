// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { opacity } from '../../src/styled';

import BlanketWithAnalytics, { Blanket } from '../Blanket';

describe('ak-blanket', () => {
  describe('exports', () => {
    it('should export a base component', () => {
      expect(Blanket).toBeInstanceOf(Object);
    });
  });

  it('should be possible to create a component', () => {
    expect(mount(<Blanket />)).not.toBe(undefined);
  });

  describe('props', () => {
    describe('isTinted', () => {
      it('should be false by default', () => {
        expect(mount(<Blanket />).prop('isTinted')).toBe(false);
      });

      it('should get tint styling when prop set', () => {
        const props = { isTinted: true };
        expect(opacity(props)).toBe(1);
      });

      it('should not get tint styling when prop set to false', () => {
        const props = { isTinted: false };
        expect(opacity(props)).toBe(0);
      });
    });

    describe('canClickThrough', () => {
      it('should be false by default', () => {
        expect(mount(<Blanket />).prop('canClickThrough')).toBe(false);
      });
      it('when canClickThrough is true, onBlanketClicked should not be triggered', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <Blanket canClickThrough onBlanketClicked={spy} />,
        );
        wrapper.simulate('click');
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });

    describe('onBlanketClicked', () => {
      it('should trigger when blanket clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(<Blanket onBlanketClicked={spy} />);
        wrapper.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
describe('analytics - Blanket', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<BlanketWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'blanket',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onBlanketClicked handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<BlanketWithAnalytics onBlanketClicked={spy} />);
    wrapper.find('button').simulate('click');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'click',
      }),
    );
  });

  it('should fire an atlaskit analytics event on click', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <BlanketWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(BlanketWithAnalytics).simulate('click');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'click' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'blanket',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
