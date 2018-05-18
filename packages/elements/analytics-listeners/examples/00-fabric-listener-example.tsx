import * as React from 'react';
import { mount } from 'enzyme';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import { DummyComponentWithAnalytics } from '../example-helpers';
import debug, { enableLogger } from '../example-helpers/logger';

const myOnClickHandler = () => {
  debug('DIV clicked ! Yay!');
};

const analyticsWebClientMock = {
  sendUIEvent: event => {
    debug('sendUIEvent: ', event);
  },
  sendOperationalEvent: event => {
    debug('sendOperationalEvent: ', event);
  },
  sendTrackEvent: (event: any) => {
    debug('sendTrackEvent: ', event);
  },
  sendScreenEvent: (event: any) => {
    debug('sendScreenEvent: ', event);
  },
};

export default function Example() {
  enableLogger(true);
  return (
    <FabricAnalyticsListeners client={analyticsWebClientMock}>
      <DummyComponentWithAnalytics onClick={myOnClickHandler} />
    </FabricAnalyticsListeners>
  );
}
