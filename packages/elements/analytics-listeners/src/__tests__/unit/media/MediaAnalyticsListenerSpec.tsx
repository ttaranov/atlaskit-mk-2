// tslint:disable-next-line no-implicit-dependencies
import * as React from 'react';
import { mount } from 'enzyme';
import {
  DEFAULT_SOURCE,
  UI_EVENT_TYPE,
  GasPayload,
} from '@atlaskit/analytics-gas-types';
import MediaAnalyticsListener from '../../../media/MediaAnalyticsListener';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createButtonWithAnalytics } from '../../../../examples/helpers';

describe('MediaAnalyticsListener', () => {
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

  const fireAndVerify = (eventPayload: GasPayload, expectedEvent: any) => {
    const spy = jest.fn();
    const ButtonWithAnalytics = createButtonWithAnalytics(
      eventPayload,
      FabricChannel.media,
    );

    const component = mount(
      <MediaAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <ButtonWithAnalytics onClick={spy} />
      </MediaAnalyticsListener>,
    );
    component.find(ButtonWithAnalytics).simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
  };

  it('should register an Analytics listener on the media channel', () => {
    const component = mount(
      <MediaAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <div />
      </MediaAnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.media,
    );
  });

  it('should send event with default source', () => {
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: DEFAULT_SOURCE,
      },
    );
  });

  it('should keep original source if set', () => {
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
      },
    );
  });
});
