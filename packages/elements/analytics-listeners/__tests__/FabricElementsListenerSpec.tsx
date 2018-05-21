import * as React from 'react';
import { mount } from 'enzyme';
import FabricElementsListener from '../src/FabricElementsListener';
import { DummyComponentWithAnalytics } from '../example-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { AnalyticsWebClient } from '../src/types';

describe('<FabricElementsListener />', () => {
  let analyticsWebClientMock: AnalyticsWebClient;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
  });

  it('should listen and fire an UI event with analyticsWebClient', () => {
    const compOnClick = jest.fn();
    const component = mount(
      <FabricElementsListener client={analyticsWebClientMock}>
        <DummyComponentWithAnalytics onClick={compOnClick} />
      </FabricElementsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      'fabric-elements',
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith({
      action: 'someAction',
      actionSubject: 'someComponent',
      source: 'unknown',
    });
  });
});
