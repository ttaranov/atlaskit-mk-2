// @flow

import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default (
  <div>
    {md`
      The \`datetime-picker\` component is capable of rendering a date picker, time picker, or combinations of both, and is
      composed from \`@atlaskit/calendar\` and \`@atlaskit/input\`.

      ## Examples

      ${(
        <Example
          Component={require('../examples/01-basic').default}
          title="Basic"
          source={require('!!raw-loader!../examples/01-basic')}
        />
      )}

      ## Datepicker
    `}
    <Props
      props={require('!!extract-react-types-loader!../src/components/DatePicker')}
    />
    {md`
      ## Timepicker

    `}
    <Props
      props={require('!!extract-react-types-loader!../src/components/TimePicker')}
    />
    {md`
      ## DateTimePicker

    `}
    <Props
      props={require('!!extract-react-types-loader!../src/components/DateTimePicker')}
    />
  </div>
);
