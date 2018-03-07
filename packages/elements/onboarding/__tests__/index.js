// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

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
import { SpotlightManager, SpotlightTarget } from '../src';

import SpotlightWithAnalytics, { Spotlight } from '../src/components/Spotlight';

function render(jsx) {
  return ReactDOMServer.renderToStaticMarkup(jsx);
}
function assertEqual(actual, expected) {
  expect(render(actual)).toBe(render(expected));
}

/* eslint-disable jest/no-disabled-tests */
describe(name, () => {
  describe('manager', () => {
    it('should render as a div by default', () => {
      assertEqual(
        <SpotlightManager>
          <span>foo</span>
        </SpotlightManager>,
        // should equal
        <div>
          <span>foo</span>
        </div>,
      );
    });
    it('should accept component as a prop', () => {
      assertEqual(
        <SpotlightManager component="section">
          <span>foo</span>
        </SpotlightManager>,
        // should equal
        <section>
          <span>foo</span>
        </section>,
      );
    });
    it('should accept complex component as a prop', () => {
      assertEqual(
        <SpotlightManager component={props => <blockquote {...props} />}>
          <span>foo</span>
        </SpotlightManager>,
        // should equal
        <blockquote>
          <span>foo</span>
        </blockquote>,
      );
    });
  });
  describe('target', () => {
    it('should render its children only', () => {
      assertEqual(
        <SpotlightManager>
          <SpotlightTarget name="foo">
            <span>foo</span>
          </SpotlightTarget>
        </SpotlightManager>,
        // should equal
        <div>
          <span>foo</span>
        </div>,
      );
    });
  });
  describe.skip('spotlight', () => {
    it('should render content', () => {
      assertEqual(
        <SpotlightManager>
          <div>
            <SpotlightTarget name="qux">
              <span>qux</span>
            </SpotlightTarget>
            <Spotlight
              header={() => <span>foo</span>}
              footer={() => <span>baz</span>}
              target="qux"
            >
              <span>bar</span>
            </Spotlight>
          </div>
        </SpotlightManager>,
        // should equal
        <div>
          <span>foo</span>
          <span>bar</span>
          <span>baz</span>
        </div>,
      );
    });
    it('should render SpotlightTarget in Spotlight', () => {
      assertEqual(
        <SpotlightManager>
          <div>
            <section>
              <Spotlight target="foo">
                <span>dialog</span>
              </Spotlight>
            </section>
            <SpotlightTarget name="foo">
              <span>target</span>
            </SpotlightTarget>
          </div>
        </SpotlightManager>,
        // should equal
        <div>
          <section>
            <span>dialog</span>
          </section>
          <span>target</span>
        </div>,
      );
    });
  });
});
describe('analytics - Spotlight', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<SpotlightWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'spotlight',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to targetOnClick handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<SpotlightWithAnalytics targetOnClick={spy} />);
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
        <SpotlightWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(SpotlightWithAnalytics).simulate('click');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'click' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'spotlight',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
