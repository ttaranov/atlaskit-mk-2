// @flow
import * as React from 'react';
import path from 'path';
import { md, Example, Props } from '@atlaskit/docs';
import BasicExample from '../examples/0-basic';

export default md`
  Badges are visual indicators for numeric values such as tallies and scores.
  They're commonly used before and after the label of the thing they're
  quantifying.

  They must be used once after a single item name, and have only numbers.

  - Use lozenges for statuses.
  - Use labels to call out tags and high-visibility attributes.
  - Use a tooltip if you want to indicate units.

  ${<Example component={<BasicExample />}/>}

  ${<Props src={path.join(__dirname, '../src/components/Badge.js')}/>}
`;
