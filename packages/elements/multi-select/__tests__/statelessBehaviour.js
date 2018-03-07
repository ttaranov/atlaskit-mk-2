// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import {
  name,
  name as packageName,
  version as packageVersion,
} from '../package.json';

import MultiSelectStatelessWithAnalytics, {
  MultiSelectStateless,
} from '../src/components/Stateless';

describe(`${name} - stateless`, () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('behavior', () => {
    let select;
    beforeEach(() => {
      select = mount(<MultiSelectStateless />);
    });

    describe('focus', () => {
      it('should focus the input field if shouldFocus is set to true', () => {
        const input = select.find('input');
        expect(document.activeElement).not.toBe(input.instance());
        select.setProps({ shouldFocus: true });
        expect(document.activeElement).toBe(input.instance());
      });
    });
  });
});
describe('analytics - MultiSelectStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<MultiSelectStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'multi-select',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onFilterChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <MultiSelectStatelessWithAnalytics onFilterChange={spy} />,
    );
    wrapper.find('button').simulate('filter');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'filter',
      }),
    );
  });

  it('should pass analytics event as last argument to onNewItemCreated handler', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <MultiSelectStatelessWithAnalytics onNewItemCreated={spy} />,
    );
    wrapper.find('button').simulate('createItem');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'createItem',
      }),
    );
  });

  it('should pass analytics event as last argument to onSelectedChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <MultiSelectStatelessWithAnalytics onSelectedChange={spy} />,
    );
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should pass analytics event as last argument to onOpenChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <MultiSelectStatelessWithAnalytics onOpenChange={spy} />,
    );
    wrapper.find('button').simulate('toggle');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'toggle',
      }),
    );
  });

  it('should fire an atlaskit analytics event on filter', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <MultiSelectStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(MultiSelectStatelessWithAnalytics).simulate('filter');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'filter' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'multi-select',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on createItem', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <MultiSelectStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(MultiSelectStatelessWithAnalytics).simulate('createItem');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'createItem' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'multi-select',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <MultiSelectStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(MultiSelectStatelessWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'multi-select',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on toggle', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <MultiSelectStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(MultiSelectStatelessWithAnalytics).simulate('toggle');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'toggle' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'multi-select',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
