import * as React from 'react';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import { AnalyticsListener } from '@atlaskit/analytics-next';

const logEvent = event => {
  const { eventType, action, actionSubject, actionSubjectId } = event.payload;
  console.log(
    `${eventType} | ${action} ${actionSubject} ${actionSubjectId}`,
    event,
  );
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
          <AnalyticsListener onEvent={logEvent} channel="fabric-elements">
            <GlobalQuickSearch cloudId="cloudId" context="confluence" />
          </AnalyticsListener>
        }
      />
    );
  }
}
