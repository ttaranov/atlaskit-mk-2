// @flow
import React from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import Radio from './RadioBase';

// $FlowFixMe
const RadioWithTheme = withAnalyticsContext({
  component: 'field-radio-group',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(withTheme(Radio)),
);

const emptyTheme = {};
// $FlowFixMe
export default function(props) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <RadioWithTheme {...props} />
    </ThemeProvider>
  );
}
