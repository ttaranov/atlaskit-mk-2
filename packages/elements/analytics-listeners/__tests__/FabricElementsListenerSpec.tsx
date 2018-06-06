import * as React from 'react';
import { mount } from 'enzyme';
import FabricElementsListener, {
  ELEMENTS_CHANNEL,
  ELEMENTS_TAG,
} from '../src/FabricElementsListener';
import {
  DummyComponentWithAnalytics,
  TaggedDummyComponentWithAnalytics,
  Props,
} from '../examples/helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { AnalyticsWebClient } from '../src/types';

describe('<FabricElementsListener />', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let loggerMock;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  });

  const fireAndVerifySentEvent = (
    Component: React.StatelessComponent<Props>,
    expectedEvent: any,
  ) => {
    const compOnClick = jest.fn();
    const component = mount(
      <FabricElementsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <Component onClick={compOnClick} />
      </FabricElementsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      ELEMENTS_CHANNEL,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
  };

  it('should listen and fire an UI event with analyticsWebClient', () => {
    fireAndVerifySentEvent(DummyComponentWithAnalytics, {
      action: 'someAction',
      actionSubject: 'someComponent',
      source: 'unknown',
      tags: [ELEMENTS_TAG],
    });
  });

  it('should listen and fire an UI event with analyticsWebClient without duplicating the tag', () => {
    fireAndVerifySentEvent(TaggedDummyComponentWithAnalytics, {
      action: 'someAction',
      actionSubject: 'someComponent',
      source: 'unknown',
      tags: [ELEMENTS_TAG, 'foo'],
    });
  });
});
