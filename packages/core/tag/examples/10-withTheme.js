// @flow
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import React from 'react';
import Tag from '../src';

export default () => (
  <div>
    <AtlaskitThemeProvider mode="light">
      <p>
        standard: <Tag text="standard">Standard</Tag>
      </p>
      <p>
        appearance: blueLight <Tag text="Blue Light" appearance="blueLight" />
      </p>
      <p>
        appearance: {`{ backgroundColor: 'green' }`}{' '}
        <Tag
          text="background colored"
          appearance={{ backgroundColor: 'green' }}
        />
      </p>
      <p>
        appearance: {`{ backgroundColor: 'yellow', textColor: 'blue' }`}{' '}
        <Tag
          text="background and text colored"
          appearance={{ backgroundColor: 'yellow', textColor: 'blue' }}
        />
      </p>
    </AtlaskitThemeProvider>
  </div>
);
