// @flow
import React from 'react';
import Button from '@atlaskit/button';

import Tooltip from '../src';

export default () => (
  <div>
    <Tooltip description="Hello World">
      <Button>Hover Over Me</Button>
    </Tooltip>
  </div>
);
