// @flow

import { AtlaskitThemeProvider } from '@atlaskit/theme';
import React from 'react';
import Badge from '../src';

export default function Example() {
  return (
    <div>
      <AtlaskitThemeProvider mode="dark">
        <p>
          Default: <Badge value={1} />
        </p>
        <p>
          appearance: important <Badge value={2} appearance="important" />
        </p>
        <p>
          appearance: {`{ backgroundColor: 'green' }`}{' '}
          <Badge value={3} appearance={{ backgroundColor: 'green' }} />
        </p>
        <p>
          appearance: {`{ backgroundColor: 'green', textColor: 'light green' }`}{' '}
          <Badge
            value={3}
            appearance={{ backgroundColor: 'green', textColor: 'light green' }}
          />
        </p>
      </AtlaskitThemeProvider>
    </div>
  );
}
