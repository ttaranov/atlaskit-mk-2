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

export { Radio as AkRadio };

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

// $FlowFixMe
const RadioWithTheme = withAnalyticsContext({
  component: 'field-radio-group',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'change',
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
