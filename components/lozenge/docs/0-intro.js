// @flow
import * as React from 'react';
import path from 'path';
import { md, Example, Props } from 'website-display-thingy';

export default md`
  Use lozenges to highlight an item's status for quick recognition. Use
  subtle lozenges by default and in instances where they may dominate the
  screen, such as in long tables.

  ${<Example src={path.join(__dirname, '../examples/0-basic.js')}/>}
  ${<Props src={path.join(__dirname, '../src/components/Badge.js')}/>}
`;
