import * as React from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import FabricAnalyticsListeners, { FabricChannel } from '../src';
import {
  createComponentWithAnalytics,
  createComponentWithAttributesWithAnalytics,
} from './helpers';

const DummyElementsComponent = createComponentWithAnalytics(
  FabricChannel.elements,
);
const DummyElementsComponentWithAttributes = createComponentWithAttributesWithAnalytics(
  FabricChannel.elements,
);
const DummyAtlaskitComponent = createComponentWithAnalytics(
  FabricChannel.atlaskit,
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
    <FabricAnalyticsListeners
      client={analyticsWebClientMock}
      excludedChannels={[FabricChannel.atlaskit]}
    >
      <div>
        <p>Excluding analytics listener</p>
        <DummyElementsComponent onClick={myOnClickHandler} />

        <AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>
          <AnalyticsContext data={{ issueId: 200 }}>
            <DummyElementsComponentWithAttributes onClick={myOnClickHandler} />
          </AnalyticsContext>
        </AnalyticsContext>

        <DummyAtlaskitComponent onClick={myOnClickHandler} />
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
