import * as React from 'react';
import { mount } from 'enzyme';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import FabricElementsListener from '../src/FabricElementsListener';
import {
  DummyComponentWithAnalytics,
  DummyComponent,
  IncorrectEventType,
  DummyAtlaskitComponentWithAnalytics,
} from '../examples/helpers';
import { AnalyticsWebClient } from '../src/types';
import { LOG_LEVEL } from '../src/helpers/logger';

declare const global: any;

describe('<FabricAnalyticsListeners />', () => {
  let analyticsWebClientMock: AnalyticsWebClient;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
  });

  describe('FabricAnalyticsListener', () => {
    it('should throw an error when no client is provided', () => {
      const compOnClick = jest.fn();
      expect(() =>
        mount(
          // @ts-ignore
          <FabricAnalyticsListeners>
            <DummyComponentWithAnalytics onClick={compOnClick} />
          </FabricAnalyticsListeners>,
        ),
      ).toThrow();
    });

    it('should log an error when an invalid event type is captured and error logging is enabled', () => {
      const originalConsoleError = global.console.error;
      global.console.error = jest.fn();
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          logLevel={LOG_LEVEL.ERROR}
        >
          <IncorrectEventType onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      const dummyComponent = analyticsListener.find(DummyComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
      expect(global.console.error).toHaveBeenCalledTimes(1);

      global.console.error = originalConsoleError;
    });
  });

  describe('<FabricElementsListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyComponentWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });
  });

  describe('<FabricAtlaskitListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyAtlaskitComponentWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });
  });
});
