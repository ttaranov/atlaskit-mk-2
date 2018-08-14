import * as React from 'react';
import { mount } from 'enzyme';
import { FabricChannel } from '../../index';
import FabricElementsListener, {
  ELEMENTS_TAG,
} from '../../FabricElementsListener';
import {
  DummyComponentWithAnalytics,
  TaggedDummyComponentWithAnalytics,
  DummyComponentWithAttributesWithAnalytics,
  Props,
} from '../../../examples/helpers';
import { AnalyticsListener, AnalyticsContext } from '@atlaskit/analytics-next';
import { AnalyticsWebClient } from '../../types';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

describe('<FabricElementsListener />', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let clientPromise: Promise<AnalyticsWebClient>;
  let loggerMock;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    clientPromise = Promise.resolve(analyticsWebClientMock);
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
      <FabricElementsListener client={clientPromise} logger={loggerMock}>
        <Component onClick={compOnClick} />
      </FabricElementsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.elements,
    );

    const dummy = analyticsListener.find('#dummy');
    dummy.simulate('click');

    return clientPromise.then(client => {
      expect(client.sendUIEvent).toBeCalledWith(expectedEvent);
    });
  };

  describe('Listen and fire an UI event with analyticsWebClient', () => {
    it('should fire event with elements tag', () => {
      fireAndVerifySentEvent(DummyComponentWithAnalytics, {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'unknown',
        tags: [ELEMENTS_TAG],
      });
    });

    it('should fire event without duplicating the tag', () => {
      fireAndVerifySentEvent(TaggedDummyComponentWithAnalytics, {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'unknown',
        tags: [ELEMENTS_TAG, 'foo'],
      });
    });

    it('should fire event with context merged into the attributes', () => {
      const component = mount(
        <FabricElementsListener client={clientPromise} logger={loggerMock}>
          <FabricElementsAnalyticsContext
            data={{ issueId: 100, greeting: 'hello' }}
          >
            <AnalyticsContext data={{ issueId: 200, msg: 'boo' }}>
              <FabricElementsAnalyticsContext data={{ issueId: 300 }}>
                <DummyComponentWithAttributesWithAnalytics
                  onClick={jest.fn()}
                />
              </FabricElementsAnalyticsContext>
            </AnalyticsContext>
          </FabricElementsAnalyticsContext>
        </FabricElementsListener>,
      );

      const analyticsListener = component.find(AnalyticsListener);
      const dummy = analyticsListener.find('#dummy');
      dummy.simulate('click');

      // note: AnalyticsContext data should not be in propagated in the attributes, only FabricElementsAnalyticsContext
      return clientPromise.then(client => {
        expect(client.sendUIEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'someAction',
            actionSubject: 'someComponent',
            source: 'unknown',
            attributes: {
              packageName: '@atlaskit/foo',
              packageVersion: '1.0.0',
              componentName: 'foo',
              fooBar: 'yay',
              greeting: 'hello',
              issueId: 300, // right most object attribute wins the conflict
            },
            tags: [ELEMENTS_TAG],
          }),
        );
      });
    });
  });
});
