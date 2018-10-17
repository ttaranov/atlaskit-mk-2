import * as React from 'react';
import { AnalyticsListener } from '../../../core/analytics-next/src/';
import {
  setupMocks,
  teardownMocks,
  DEFAULT_MOCKS_CONFIG,
} from '../example-helpers/mockApis';
import { GlobalQuickSearch } from '../src';
import withNavigation from '../example-helpers/withNavigation';

const GlobalQuickSearchInNavigation = withNavigation(GlobalQuickSearch);

const logEvent = event => {
  const { eventType, action, actionSubject, actionSubjectId } = event.payload;
  console.debug(
    `${eventType} | ${action} ${actionSubject} ${actionSubjectId}`,
    event.payload.attributes,
    event.payload,
  );
};

export default class extends React.Component {
  componentWillMount() {
    setupMocks({
      ...DEFAULT_MOCKS_CONFIG,
      canSearchUsers: false,
    });
  }

  componentWillUnmount() {
    teardownMocks();
  }

  render() {
    return (
      <AnalyticsListener onEvent={logEvent} channel="fabric-elements">
        <GlobalQuickSearchInNavigation />
      </AnalyticsListener>
    );
  }
}
