import * as React from 'react';
import { mount, shallow } from 'enzyme';
import FabricAnalyticsListeners from '../../FabricAnalyticsListeners';
import FabricElementsListener from '../../fabric/FabricElementsListener';
import AtlaskitListener from '../../atlaskit/AtlaskitListener';
import {
  createComponentWithAnalytics,
  IncorrectEventType,
  DummyAtlaskitComponent,
  DummyNavigationComponent,
  DummyElementsComponent,
} from '../../../examples/helpers';
import { AnalyticsWebClient, FabricChannel } from '../../types';
import { LOG_LEVEL } from '../../helpers/logger';
import NavigationListener from '../../navigation/NavigationListener';

declare const global: any;

const DummyElementsCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.elements,
);
const DummyAtlaskitCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.atlaskit,
);
const DummyNavigationCompWithAnalytics = createComponentWithAnalytics(
  FabricChannel.navigation,
);
const AtlaskitIncorrectEventType = IncorrectEventType(FabricChannel.atlaskit);

describe('<FabricAnalyticsListeners />', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let originalConsoleError;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    originalConsoleError = global.console.error;
    global.console.error = jest.fn();
  });

  afterEach(() => {
    global.console.error = originalConsoleError;
  });

  describe('FabricAnalyticsListener', () => {
    it('should throw an error when no client is provided', () => {
      const compOnClick = jest.fn();
      expect(() =>
        mount(
          // @ts-ignore
          <FabricAnalyticsListeners>
            <DummyElementsCompWithAnalytics onClick={compOnClick} />
          </FabricAnalyticsListeners>,
        ),
      ).toThrow();
    });

    it('should log an error when an invalid event type is captured and error logging is enabled', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          logLevel={LOG_LEVEL.ERROR}
        >
          <AtlaskitIncorrectEventType onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      const dummyComponent = analyticsListener.find(DummyAtlaskitComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');
      expect(global.console.error).toHaveBeenCalledTimes(1);
    });

    it('should render all listeners', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      expect(component).toMatchSnapshot();
    });

    it('should render a FabricElementsListener', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(1);
      expect(elementsListener.props()).toEqual(
        expect.objectContaining({
          client: analyticsWebClientMock,
        }),
      );
    });

    it('should render an AtlaskitListener', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const atlaskitListener = component.find(AtlaskitListener);

      expect(atlaskitListener).toHaveLength(1);
      expect(atlaskitListener.props()).toEqual(
        expect.objectContaining({
          client: analyticsWebClientMock,
        }),
      );
    });

    it('should render a NavigationListener', () => {
      const component = shallow(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const navigationListener = component.find(NavigationListener);

      expect(navigationListener).toHaveLength(1);
      expect(navigationListener.props()).toEqual(
        expect.objectContaining({
          client: analyticsWebClientMock,
        }),
      );
    });

    it('should exclude the AtlaskitListener if excludedChannels includes atlaskit', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.atlaskit]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const atlaskitListener = component.find(AtlaskitListener);

      expect(atlaskitListener).toHaveLength(0);

      const elementsListener = component.find(FabricElementsListener);
      expect(elementsListener).toHaveLength(1);
    });

    it('should exclude the ElementsListener if excludedChannels includes elements', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.elements]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(0);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(1);
    });

    it('should exclude the NavigationListener if excludedChannels includes navigation', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.navigation]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const navigationListener = component.find(NavigationListener);

      expect(navigationListener).toHaveLength(0);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(1);

      const elementsListener = component.find(FabricElementsListener);
      expect(elementsListener).toHaveLength(1);
    });

    it('should exclude both atlaskit and elements listeners if excludedChannels includes both their channels', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[FabricChannel.elements, FabricChannel.atlaskit]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(0);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(0);

      expect(component.find('div').text()).toBe('Child');
    });

    it('should not exclude any listeners if excludeChannels is empty', () => {
      const component = shallow(
        <FabricAnalyticsListeners
          client={analyticsWebClientMock}
          excludedChannels={[]}
        >
          <div>Child</div>
        </FabricAnalyticsListeners>,
      );

      const elementsListener = component.find(FabricElementsListener);

      expect(elementsListener).toHaveLength(1);

      const atlaskitListener = component.find(AtlaskitListener);
      expect(atlaskitListener).toHaveLength(1);
    });
  });

  describe('<FabricElementsListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyElementsCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(FabricElementsListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyElementsComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });
  });

  describe('<AtlaskitListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyAtlaskitCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(AtlaskitListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyAtlaskitComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });
  });

  describe('<NavigationListener />', () => {
    it('should listen and fire a UI event with analyticsWebClient', () => {
      const compOnClick = jest.fn();
      const component = mount(
        <FabricAnalyticsListeners client={analyticsWebClientMock}>
          <DummyNavigationCompWithAnalytics onClick={compOnClick} />
        </FabricAnalyticsListeners>,
      );

      const analyticsListener = component.find(NavigationListener);
      expect(analyticsListener.props()).toHaveProperty(
        'client',
        analyticsWebClientMock,
      );

      const dummyComponent = analyticsListener.find(DummyNavigationComponent);
      expect(dummyComponent).toHaveLength(1);

      dummyComponent.simulate('click');

      expect(analyticsWebClientMock.sendUIEvent).toBeCalled();
    });
  });
});
