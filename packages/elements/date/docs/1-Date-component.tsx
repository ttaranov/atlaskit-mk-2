import * as React from 'react';
import { md, Example } from '@atlaskit/docs';
import CustomColorExample from '../examples/00-custom-colors';
import CustomFormatExample from '../examples/02-custom-format';

const CustomColorSource = require('!!raw-loader!../examples/00-custom-colors');
const CustomFormatSource = require('!!raw-loader!../examples/02-custom-format');

export default md`
### Date lozenge

Lozenge is available in the [ADG3 Lozenge colors](https://atlassian.design/guidelines/product/components/lozenges).


\`color\` prop is optional and has the following option \`'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow'\`.

${(
  <Example
    Component={CustomColorExample}
    source={CustomColorSource}
    title="Custom colors examples"
    language="javascript"
  />
)}

You can also specify custom format for the date. We use [date-fns](https://date-fns.org/). Check out [format function
documentation](https://date-fns.org/v1.29.0/docs/format).

${(
  <Example
    Component={CustomFormatExample}
    source={CustomFormatSource}
    title="Custom format examples"
    language="javascript"
  />
)}
`;
