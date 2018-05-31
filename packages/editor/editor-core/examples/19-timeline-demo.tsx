import * as React from 'react';

import Example from './5-full-page';
import { DefaultDocument } from '../example-helpers/timeline-document';

export default function TimelineDemo() {
  return <Example defaultValue={DefaultDocument} />;
}
