// @flow

import React from 'react';
import { Example } from '@atlaskit/docs';

/**
 * Load an example in an iframe
 */
export const IframeExample = ({ source, title, url }: *) => (
  <Example
    Component={() => (
      <iframe
        src={url}
        style={{
          border: 0,
          height: '500px',
          overflow: 'hidden',
          width: '100%',
        }}
        title={title}
      />
    )}
    source={source}
    title={title}
  />
);
