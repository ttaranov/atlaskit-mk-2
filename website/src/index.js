// @flow
import React from 'react';
import { render } from 'react-dom';

import '@atlaskit/css-reset';
// import { AnalyticsListener } from '@atlaskit/analytics-next';
import AnalyticsListeners from '@atlaskit/analytics-listeners';
import 'regenerator-runtime/runtime';
import App from './containers/App';
import AnalyticsPopup from './analytics-popup';

const createClient = overrides => ({
  sendUIEvent: (event: any) => console.log('sendUIEvent', event),
  sendOperationalEvent: (event: any) =>
    console.log('sendOperationalEvent', event),
  sendTrackEvent: (event: any) => console.log('sendTrackEvent', event),
  sendScreenEvent: (event: any) => console.log('sendScreenEvent', event),
  ...overrides,
});

class AppWithAnalytics extends React.Component<{}> {
  client = createClient({
    sendUIEvent: event => {
      if (this.onEventHandler) {
        this.onEventHandler(event);
      }
    },
  });
  render() {
    return (
      <React.Fragment>
        <AnalyticsListeners client={Promise.resolve(this.client)}>
          <App />
        </AnalyticsListeners>
        <AnalyticsPopup
          onEvent={handler => {
            this.onEventHandler = handler;
          }}
        />
      </React.Fragment>
    );
  }
}

render(<AppWithAnalytics />, document.getElementById('app'));
