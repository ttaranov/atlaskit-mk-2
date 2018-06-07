import * as React from 'react';
import { mount } from 'enzyme';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import {
  DummyComponentWithAnalytics,
  DummyAtlaskitComponentWithAnalytics,
} from '../examples/helpers';

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

export default function Example() {
  return (
    <FabricAnalyticsListeners client={Promise.resolve(analyticsWebClientMock)}>
      <div>
        <DummyComponentWithAnalytics onClick={myOnClickHandler} />
        <DummyAtlaskitComponentWithAnalytics onClick={myOnClickHandler} />
      </div>
    </FabricAnalyticsListeners>
  );
}
