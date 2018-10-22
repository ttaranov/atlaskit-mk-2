// @flow

import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The calendar component displays a simple calendar that can be:

  - Used to display a calendar of dates.
  - Composed with other components to build a datepicker.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/calendar"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Calendar')}
    />
  )}
`;
