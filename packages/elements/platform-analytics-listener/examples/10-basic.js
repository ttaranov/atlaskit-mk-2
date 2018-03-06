// @flow

import React from 'react';
import Button from '@atlaskit/button';

import PlatformAnalyticsListener from '../src';

// In products this will be a properly configured AnalyticsWebClient
// https://bitbucket.org/atlassian/analytics-web-client
const mockAnalyticsClient = {
  sendUIEvent(event) {
    console.log('Received event:', event);
  },
};

export default () => (
  <PlatformAnalyticsListener analyticsClient={mockAnalyticsClient}>
    <Button>Click me</Button>
  </PlatformAnalyticsListener>
);
