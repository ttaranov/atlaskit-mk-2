import * as React from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import FabricAnalyticsListeners, { FabricChannel } from '../src';
import {
  DummyComponentWithAnalytics,
  DummyAtlaskitComponentWithAnalytics,
  DummyComponentWithAttributesWithAnalytics,
} from './helpers';

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
        <DummyComponentWithAnalytics
          text="Fabric Elements event - component without attributes"
          onClick={myOnClickHandler}
        />

        <AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>
          <AnalyticsContext data={{ issueId: 200 }}>
            <DummyComponentWithAttributesWithAnalytics
              text="Fabric Elements event - component with attributes"
              onClick={myOnClickHandler}
            />
          </AnalyticsContext>
        </AnalyticsContext>

        <DummyAtlaskitComponentWithAnalytics onClick={myOnClickHandler} />
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
