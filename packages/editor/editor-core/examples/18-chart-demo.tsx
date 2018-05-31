import * as React from 'react';

import Example from './5-full-page';
import { DefaultDocument } from '../example-helpers/chart-document';

export default function ChartDemo() {
  return <Example defaultValue={DefaultDocument} />;
}
