// @flow
import React from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import Radio from './RadioBase';

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

// $FlowFixMe
const RadioWithTheme = withAnalyticsContext({
  componentName: 'field-radio-group',
  packageName: packageName,
  packageVersion: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'field-radio-group',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),
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
