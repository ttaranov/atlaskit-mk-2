import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

const shouldLogEvents = true;

const logEvent = event => {
  if (shouldLogEvents) {
    const { eventType, action, actionSubject, actionSubjectId } = event.payload;
    console.log(
      `${eventType} | ${action} ${actionSubject} ${actionSubjectId}`,
      event.payload.attributes,
      event.payload,
    );
  }
};

export default class extends React.Component {
  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  render() {
    return (
      <BasicNavigation
        searchDrawerContent={
          <LocaleIntlProvider>
            <AnalyticsListener onEvent={logEvent} channel="fabric-elements">
              <GlobalQuickSearch cloudId="cloudId" context="confluence" />
            </AnalyticsListener>
          </LocaleIntlProvider>
        }
      />
    );
  }
}
