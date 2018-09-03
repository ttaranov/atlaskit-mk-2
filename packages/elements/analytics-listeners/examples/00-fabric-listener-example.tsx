import * as React from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import {
  createComponentWithAnalytics,
  createComponentWithAttributesWithAnalytics,
} from './helpers';
import { FabricChannel } from '../src/types';

const DummyElementsComponent = createComponentWithAnalytics(
  FabricChannel.elements,
);
const DummyElementsComponentWithAttributes = createComponentWithAttributesWithAnalytics(
  FabricChannel.elements,
);
const DummyAtlaskitComponent = createComponentWithAnalytics(
  FabricChannel.atlaskit,
);
const DummyNavigationComponent = createComponentWithAnalytics(
  FabricChannel.navigation,
);

const myOnClickHandler = () => {
  console.log('Button clicked ! Yay!');
};

const analyticsWebClientMock = {
  sendUIEvent: event => {
    console.log('sendUIEvent: ', event);
  },
  sendOperationalEvent: event => {
    console.log('sendOperationalEvent: ', event);
  },
  sendTrackEvent: (event: any) => {
    console.log('sendTrackEvent: ', event);
  },
  sendScreenEvent: (event: any) => {
    console.log('sendScreenEvent: ', event);
  },
};

function Example() {
  return (
    <FabricAnalyticsListeners client={analyticsWebClientMock}>
      <div>
        <DummyElementsComponent onClick={myOnClickHandler} />

        <AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>
          <AnalyticsContext data={{ issueId: 200 }}>
            <DummyElementsComponentWithAttributes onClick={myOnClickHandler} />
          </AnalyticsContext>
        </AnalyticsContext>

        <DummyAtlaskitComponent onClick={myOnClickHandler} />

        <AnalyticsContext
          data={{
            component: 'page',
            packageName: '@atlaskit/page',
            packageVersion: '2.0.1',
            attributes: { pageName: 'myPage' },
            source: 'homePage',
          }}
        >
          <AnalyticsContext
            data={{
              component: 'myComponent',
              packageName: '@atlaskit/my-component',
              packageVersion: '1.0.0',
              attributes: { customAttr: true },
              source: 'componentPage',
            }}
          >
            <DummyNavigationComponent onClick={myOnClickHandler} />
          </AnalyticsContext>
        </AnalyticsContext>
      </div>
    </FabricAnalyticsListeners>
  );
}

Object.assign(Example, {
  meta: {
    noListener: true,
  },
});

export default Example;
